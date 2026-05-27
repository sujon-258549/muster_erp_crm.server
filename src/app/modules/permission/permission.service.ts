import type { Prisma } from "../../../generated/prisma/client.js";
import httpStatus from "http-status";
import prisma from "../../utils/prismaClient.ts";
import ApiError from "../../middleware/apiError.ts";
import { permissionSearchableFields } from "./permission.constant.ts";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";
import { getIO } from "../../utils/socket.ts";
import {
  assertTenantAccess,
  isPlatformAdmin,
  type ActorContext,
} from "../../utils/tenant.ts";

// RolePermission has no branchId of its own — its tenant scope is
// inherited from the Role it belongs to. Resolve it via the relation.
const resolveRoleBranchId = async (roleId: string | null | undefined) => {
  if (!roleId) return null;
  const role = await prisma.allRole.findUnique({
    where: { id: roleId },
    select: { branchId: true },
  });
  return role?.branchId ?? null;
};

const createPermission = async (payload: any, actor?: ActorContext) => {
  const roleExists = await prisma.allRole.findUnique({
    where: { id: payload.roleId },
    select: { id: true, branchId: true },
  });
  if (!roleExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "Role not found");
  }
  if (actor) assertTenantAccess(actor, roleExists.branchId);

  const duplicate = await prisma.rolePermission.findFirst({
    where: { roleId: payload.roleId, module: payload.module },
  });
  if (duplicate) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Permission for this role & module already exists",
    );
  }

  const result = await prisma.rolePermission.create({ data: payload });
  return result;
};

const getAllPermission = async (query: any, actor?: ActorContext) => {
  const { searchTerm, page, limit, sortBy, sortOrder, ...queryFilter } = query;

  const andCondition: Prisma.RolePermissionWhereInput[] = [];
  const { pageNumber, limitNumber, skip, sortOrderValue, sortByValue } =
    calculatePaginationOrSort(page, limit, sortBy, sortOrder);

  if (searchTerm) {
    andCondition.push({
      OR: permissionSearchableFields.map((field: string) => ({
        [field]: { contains: searchTerm, mode: "insensitive" },
      })),
    });
  }

  if (Object.keys(queryFilter).length > 0) {
    andCondition.push({
      AND: Object.keys(queryFilter).map((key: string) => ({
        [key]: { equals: queryFilter[key as keyof typeof queryFilter] },
      })),
    });
  }

  // Tenant scoping — non-platform users only see permission rows whose
  // parent Role lives in their branch.
  if (actor && !isPlatformAdmin(actor.role)) {
    andCondition.push({ role: { branchId: actor.branchId ?? null } });
  }

  // Only include the AND key when we actually have conditions; with
  // `exactOptionalPropertyTypes: true` Prisma's input type rejects explicit
  // `undefined`.
  const whereCondition: Prisma.RolePermissionWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.rolePermission.findMany({
    where: whereCondition,
    skip,
    take: limitNumber,
    orderBy: { [sortByValue]: sortOrderValue },
    include: { role: true },
  });

  const total = await prisma.rolePermission.count({ where: whereCondition });

  return {
    data: result,
    meta: { page: pageNumber, limit: limitNumber, total },
  };
};

const getPermissionById = async (id: string, actor?: ActorContext) => {
  const result = await prisma.rolePermission.findUnique({
    where: { id },
    include: { role: true },
  });
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, "Permission not found");
  if (actor) assertTenantAccess(actor, result.role?.branchId ?? null);
  return result;
};

const getPermissionsByRole = async (roleId: string, actor?: ActorContext) => {
  if (actor) assertTenantAccess(actor, await resolveRoleBranchId(roleId));
  const result = await prisma.rolePermission.findMany({
    where: { roleId },
    orderBy: { module: "asc" },
  });
  return result;
};

const updatePermission = async (
  id: string,
  payload: any,
  actor?: ActorContext,
) => {
  const exists = await prisma.rolePermission.findUnique({
    where: { id },
    select: { id: true, roleId: true },
  });
  if (!exists) throw new ApiError(httpStatus.NOT_FOUND, "Permission not found");
  if (actor) assertTenantAccess(actor, await resolveRoleBranchId(exists.roleId));

  const result = await prisma.rolePermission.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deletePermission = async (id: string, actor?: ActorContext) => {
  const exists = await prisma.rolePermission.findUnique({
    where: { id },
    select: { id: true, roleId: true },
  });
  if (!exists) throw new ApiError(httpStatus.NOT_FOUND, "Permission not found");
  if (actor) assertTenantAccess(actor, await resolveRoleBranchId(exists.roleId));

  await prisma.rolePermission.delete({ where: { id } });
  return { message: "Permission deleted successfully" };
};

// Bulk-sync the full permission map for a role in one atomic transaction:
//   - Modules with a non-empty `permissions` array are upserted.
//   - Modules sent with an empty array are deleted (the row goes away).
//   - Modules already in DB but NOT in the payload at all are left as is.
//     (Send module with [] to revoke.)
// Returns the fresh row list so the client can reseed its grid.
const replacePermissionsForRole = async (
  roleId: string,
  permissions: { module: string; permissions: string[] }[],
  actor?: ActorContext,
) => {
  const roleExists = await prisma.allRole.findUnique({
    where: { id: roleId },
    select: { id: true, branchId: true },
  });
  if (!roleExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "Role not found");
  }
  if (actor) assertTenantAccess(actor, roleExists.branchId);

  await prisma.$transaction(async (tx) => {
    for (const entry of permissions) {
      const existing = await tx.rolePermission.findFirst({
        where: { roleId, module: entry.module },
        select: { id: true },
      });

      if (entry.permissions.length === 0) {
        if (existing) {
          await tx.rolePermission.delete({ where: { id: existing.id } });
        }
        continue;
      }

      if (existing) {
        await tx.rolePermission.update({
          where: { id: existing.id },
          data: { permissions: entry.permissions },
        });
      } else {
        await tx.rolePermission.create({
          data: { roleId, module: entry.module, permissions: entry.permissions },
        });
      }
    }

    // Flag every user under this role so their next /my-data fetch
    // returns forceReload=true and the frontend can refresh. Also kept as
    // a backstop for users who are offline when the socket event fires.
    await tx.user.updateMany({
      where: { roleId },
      data: { forceReload: true },
    });
  });

  // Real-time push to every connected client under this role. Each user
  // joins a room keyed by their userId on socket connect, so we look up
  // affected users and emit to each of their rooms.
  try {
    const affected = await prisma.user.findMany({
      where: { roleId },
      select: { id: true },
    });
    const io = getIO();
    for (const u of affected) {
      io.to(u.id).emit("force-reload", { reason: "permissions-changed" });
    }
  } catch {
    // Socket layer not initialised (e.g. during tests) — fall back to the
    // forceReload DB flag which the next /my-data poll will pick up.
  }

  return await prisma.rolePermission.findMany({
    where: { roleId },
    orderBy: { module: "asc" },
  });
};

export const PermissionServices = {
  createPermission,
  getAllPermission,
  getPermissionById,
  getPermissionsByRole,
  updatePermission,
  deletePermission,
  replacePermissionsForRole,
};
