import type { Prisma } from "../../../generated/prisma/client.js";
import httpStatus from "http-status";
import prisma from "../../utils/prismaClient.ts";
import ApiError from "../../middleware/apiError.ts";
import { permissionSearchableFields } from "./permission.constant.ts";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";

const createPermission = async (payload: any) => {
  const roleExists = await prisma.allRole.findUnique({
    where: { id: payload.roleId },
  });
  if (!roleExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "Role not found");
  }

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

const getAllPermission = async (query: any) => {
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

  const whereCondition: Prisma.RolePermissionWhereInput = {
    AND: andCondition.length > 0 ? andCondition : undefined,
  };

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

const getPermissionById = async (id: string) => {
  const result = await prisma.rolePermission.findUnique({
    where: { id },
    include: { role: true },
  });
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, "Permission not found");
  return result;
};

const getPermissionsByRole = async (roleId: string) => {
  const result = await prisma.rolePermission.findMany({
    where: { roleId },
    orderBy: { module: "asc" },
  });
  return result;
};

const updatePermission = async (id: string, payload: any) => {
  const exists = await prisma.rolePermission.findUnique({ where: { id } });
  if (!exists) throw new ApiError(httpStatus.NOT_FOUND, "Permission not found");

  const result = await prisma.rolePermission.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deletePermission = async (id: string) => {
  const exists = await prisma.rolePermission.findUnique({ where: { id } });
  if (!exists) throw new ApiError(httpStatus.NOT_FOUND, "Permission not found");

  await prisma.rolePermission.delete({ where: { id } });
  return { message: "Permission deleted successfully" };
};

export const PermissionServices = {
  createPermission,
  getAllPermission,
  getPermissionById,
  getPermissionsByRole,
  updatePermission,
  deletePermission,
};
