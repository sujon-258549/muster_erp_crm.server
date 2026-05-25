import type { Prisma } from "../../../generated/prisma/client.js";
import ApiError from "../../middleware/apiError.ts";
import httpStatus from "http-status";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";
import { workTypeSearchableFields } from "./workType.const.ts";
import prisma from "../../utils/prismaClient.ts";
import type { ActorContext } from "../../utils/tenant.ts";
import { tenantFilter, assertTenantAccess } from "../../utils/tenant.ts";

const createWorkTypeIntoDB = async (payload: any, actor: ActorContext) => {
  const result = await prisma.workType.create({
    data: {
      ...payload,
      branchId: actor.branchId ?? null,
    },
  });
  return result;
};

const getAllWorkType = async (query: any, actor: ActorContext) => {
  const { page, limit, searchTerm, sortBy, sortOrder, ...filter } = query;

  const andCondition: Prisma.WorkTypeWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: workTypeSearchableFields.map((text: string) => ({
        [text]: { contains: searchTerm, mode: "insensitive" },
      })),
    });
  }

  if (filter.isActive) {
    filter.isActive = filter.isActive === "true";
  }

  const { pageNumber, limitNumber, skip, sortOrderValue, sortByValue } =
    calculatePaginationOrSort(page, limit, sortBy, sortOrder);

  const where: Prisma.WorkTypeWhereInput = {
    AND: andCondition.length > 0 ? andCondition : undefined,
    ...filter,
    ...tenantFilter(actor),
  };

  const result = await prisma.workType.findMany({
    where,
    take: limitNumber,
    skip: skip,
    orderBy: { [sortByValue]: sortOrderValue },
  });

  const total = await prisma.workType.count({ where });

  return {
    data: result,
    meta: { page: pageNumber, limit: limitNumber, total },
  };
};

const getWorkTypeById = async (id: string, actor: ActorContext) => {
  const result = await prisma.workType.findUnique({ where: { id } });
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, "WorkType not found");
  assertTenantAccess(actor, result.branchId);
  return result;
};

const updateWorkType = async (
  id: string,
  payload: any,
  actor: ActorContext,
) => {
  const existing = await prisma.workType.findUnique({ where: { id } });
  if (!existing) throw new ApiError(httpStatus.NOT_FOUND, "WorkType not found");
  assertTenantAccess(actor, existing.branchId);

  const result = await prisma.workType.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deleteWorkType = async (id: string, actor: ActorContext) => {
  const existing = await prisma.workType.findUnique({ where: { id } });
  if (!existing) throw new ApiError(httpStatus.NOT_FOUND, "WorkType not found");
  assertTenantAccess(actor, existing.branchId);

  const result = await prisma.workType.delete({ where: { id } });
  return result;
};

const updateWorkTypeStatus = async (id: string, actor: ActorContext) => {
  const existing = await prisma.workType.findUnique({ where: { id } });
  if (!existing) throw new ApiError(httpStatus.NOT_FOUND, "WorkType not found");
  assertTenantAccess(actor, existing.branchId);

  const result = await prisma.workType.update({
    where: { id },
    data: { isActive: !existing.isActive },
  });
  return result;
};

export const WorkTypeServices = {
  createWorkTypeIntoDB,
  getAllWorkType,
  getWorkTypeById,
  updateWorkType,
  deleteWorkType,
  updateWorkTypeStatus,
};
