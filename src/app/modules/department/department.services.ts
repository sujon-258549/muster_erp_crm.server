import type { Prisma } from "../../../generated/prisma/client.js";
import ApiError from "../../middleware/apiError.ts";
import httpStatus from "http-status";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";
import { departmentSearchableFields } from "./department.const.ts";
import prisma from "../../utils/prismaClient.ts";
import type { ActorContext } from "../../utils/tenant.ts";
import { isPlatformAdmin, tenantFilter, assertTenantAccess } from "../../utils/tenant.ts";

const createDepartmentIntoDB = async (payload: any, actor: ActorContext) => {
  const result = await prisma.department.create({
    data: {
      name: payload.name,
      description: payload.description,
      isActive: payload.isActive,
      branchId: actor.branchId ?? null,
    },
  });
  return result;
};

const getAllDepartment = async (query: any, actor: ActorContext) => {
  const { page, limit, searchTerm, sortBy, sortOrder, ...filter } = query;

  const andCondition: Prisma.DepartmentWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: departmentSearchableFields.map((text: string) => ({
        [text]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  const { pageNumber, limitNumber, skip, sortOrderValue, sortByValue } =
    calculatePaginationOrSort(page, limit, sortBy, sortOrder);

  const where: Prisma.DepartmentWhereInput = {
    AND: andCondition.length > 0 ? andCondition : undefined,
    ...filter,
    ...tenantFilter(actor),
  };

  const result = await prisma.department.findMany({
    where,
    take: limitNumber,
    skip: skip,
    orderBy: {
      [sortByValue]: sortOrderValue,
    },
    include: {
      users: {
        select: { id: true, email: true, mobile: true, roleId: true },
      },
    },
  });

  const total = await prisma.department.count({ where });

  return {
    data: result,
    meta: { page: pageNumber, limit: limitNumber, total },
  };
};

const getDepartmentById = async (id: string, actor: ActorContext) => {
  const result = await prisma.department.findUnique({
    where: { id },
    include: {
      users: {
        select: { id: true, email: true, mobile: true, roleId: true },
      },
    },
  });
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, "Department not found");
  assertTenantAccess(actor, result.branchId);
  return result;
};

const updateDepartment = async (
  id: string,
  payload: any,
  actor: ActorContext,
) => {
  const existing = await prisma.department.findUnique({ where: { id } });
  if (!existing) throw new ApiError(httpStatus.NOT_FOUND, "Department not found");
  assertTenantAccess(actor, existing.branchId);

  const result = await prisma.department.update({
    where: { id },
    data: {
      name: payload.name,
      description: payload.description,
      isActive: payload.isActive,
    },
  });
  return result;
};

const deleteDepartment = async (id: string, actor: ActorContext) => {
  const existing = await prisma.department.findUnique({ where: { id } });
  if (!existing) throw new ApiError(httpStatus.NOT_FOUND, "Department not found");
  assertTenantAccess(actor, existing.branchId);

  const result = await prisma.department.delete({ where: { id } });
  return result;
};

const updateDepartmentStatus = async (id: string, actor: ActorContext) => {
  const existing = await prisma.department.findUnique({ where: { id } });
  if (!existing) throw new ApiError(httpStatus.NOT_FOUND, "Department not found");
  assertTenantAccess(actor, existing.branchId);

  const result = await prisma.department.update({
    where: { id },
    data: { isActive: !existing.isActive },
  });
  return result;
};

export const DepartmentServices = {
  createDepartmentIntoDB,
  getAllDepartment,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  updateDepartmentStatus,
};
