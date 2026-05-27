import type { Prisma } from "../../../generated/prisma/client.js";
import httpStatus from "http-status";
import prisma from "../../utils/prismaClient.ts";
import ApiError from "../../middleware/apiError.ts";
import { roleSearchableFields } from "./role.constant.ts";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";
import {
  assertTenantAccess,
  isPlatformAdmin,
  type ActorContext,
} from "../../utils/tenant.ts";

// Roles are now per-tenant. Branch Super Admins create + see roles for
// their own branch only. Platform admins can also create global roles
// (branchId = null) like SUPER_ADMIN.

const createRole = async (payload: any, actor?: ActorContext) => {
  // Force-scope: a non-platform admin can only create a role in their
  // own branch — never globally, never in another tenant's branch.
  let superAdminRole = await prisma.allRole.findFirst({
    where: { role: "SUPER_ADMIN" },
  });
  if (!superAdminRole) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "SUPER_ADMIN role must exist before creating any other roles",
    );
  }
  const branchId =
    actor && !isPlatformAdmin(actor.role)
      ? (actor.branchId ?? null)
      : (payload.branchId ?? null);

  const isExist = await prisma.allRole.findFirst({
    where: { role: payload.role, branchId },
  });
  if (isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Role already exists");
  }
  const result = await prisma.allRole.create({
    data: { ...payload, branchId },
  });
  return result;
};

const getAllRole = async (query: any, actor?: ActorContext) => {
  const { searchTerm, page, limit, sortBy, sortOrder, ...queryFilter } = query;

  const andCondition: Prisma.AllRoleWhereInput[] = [];
  const { pageNumber, limitNumber, skip, sortOrderValue, sortByValue } =
    calculatePaginationOrSort(page, limit, sortBy, sortOrder);

  if (searchTerm) {
    andCondition.push({
      OR: roleSearchableFields.map((text: string) => ({
        [text]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(queryFilter).length > 0) {
    andCondition.push({
      AND: Object.keys(queryFilter).map((key: string) => ({
        [key]: {
          equals: queryFilter[key as keyof typeof queryFilter],
        },
      })),
    });
  }

  // Tenant scoping — non-platform users see only roles in their branch.
  if (actor && !isPlatformAdmin(actor.role)) {
    andCondition.push({ branchId: actor.branchId ?? null });
  }

  const whereCondition: Prisma.AllRoleWhereInput = {
    AND: andCondition,
  };

  const result = await prisma.allRole.findMany({
    where: whereCondition,
    skip,
    take: limitNumber,
    orderBy: {
      [sortByValue]: sortOrderValue,
    },
  });

  const total = await prisma.allRole.count({
    where: whereCondition,
  });

  return {
    data: result,
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
    },
  };
};

const getRoleById = async (id: string, actor?: ActorContext) => {
  const result = await prisma.allRole.findUnique({ where: { id } });
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, "Role not found");
  if (actor) assertTenantAccess(actor, result.branchId);
  return result;
};

const updateRole = async (id: string, payload: any, actor?: ActorContext) => {
  const existing = await prisma.allRole.findUnique({ where: { id } });
  if (!existing) throw new ApiError(httpStatus.NOT_FOUND, "Role not found");
  if (actor) {
    assertTenantAccess(actor, existing.branchId);
    if (
      !isPlatformAdmin(actor.role) &&
      payload.branchId &&
      payload.branchId !== existing.branchId
    ) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "Cannot move a role to another branch",
      );
    }
  }

  const result = await prisma.allRole.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deleteRole = async (id: string, actor?: ActorContext) => {
  const existing = await prisma.allRole.findUnique({ where: { id } });
  if (!existing) throw new ApiError(httpStatus.NOT_FOUND, "Role not found");
  if (actor) assertTenantAccess(actor, existing.branchId);

  await prisma.allRole.delete({ where: { id } });
  return { message: "Role deleted successfully" };
};

const updateRoleStatus = async (id: string, actor?: ActorContext) => {
  const isExist = await prisma.allRole.findUnique({ where: { id } });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Role not found");
  }
  if (actor) assertTenantAccess(actor, isExist.branchId);

  const result = await prisma.allRole.update({
    where: { id },
    data: { isActive: !isExist.isActive },
  });
  return result;
};

export const RoleServices = {
  createRole,
  getAllRole,
  getRoleById,
  updateRole,
  deleteRole,
  updateRoleStatus,
};
