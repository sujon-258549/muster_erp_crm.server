import type { Prisma } from "../../../generated/prisma/client.js";
import httpStatus from "http-status";
import ApiError from "../../middleware/apiError.ts";
import { subscriptionPlanSearchableFields } from "./subscriptionPlan.constant.ts";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";
import slugCreate from "../../utils/slugCreate.ts";
import prisma from "../../utils/prismaClient.ts";

const createPlan = async (payload: any) => {
  const slugBase = payload.slug || slugCreate(payload.name);
  let slug = slugBase;
  let counter = 1;
  while (await prisma.subscriptionPlan.findUnique({ where: { slug } })) {
    slug = `${slugBase}-${counter++}`;
  }

  // Frontend may send `price` as a number; Prisma stores it as String.
  const data: Prisma.SubscriptionPlanCreateInput = {
    ...payload,
    slug,
    price: payload.price != null ? String(payload.price) : null,
  };

  return prisma.subscriptionPlan.create({ data });
};

const getAllPlans = async (query: any) => {
  const { page, limit, searchTerm, sortBy, sortOrder, ...filter } = query;

  const andCondition: Prisma.SubscriptionPlanWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: subscriptionPlanSearchableFields.map((text: string) => ({
        [text]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  const { pageNumber, limitNumber, skip, sortOrderValue, sortByValue } =
    calculatePaginationOrSort(page, limit, sortBy, sortOrder);

  const data = await prisma.subscriptionPlan.findMany({
    where: {
      AND: andCondition,
      ...filter,
    },
    take: limitNumber,
    skip,
    orderBy: { [sortByValue]: sortOrderValue },
  });

  const total = await prisma.subscriptionPlan.count({
    where: { AND: andCondition, ...filter },
  });

  return {
    data,
    meta: { page: pageNumber, limit: limitNumber, total },
  };
};

const getPlanById = async (id: string) => {
  const result = await prisma.subscriptionPlan.findFirst({ where: { id } });
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, "Plan not found");
  return result;
};

const updatePlan = async (id: string, payload: any) => {
  const existing = await prisma.subscriptionPlan.findUnique({ where: { id } });
  if (!existing) throw new ApiError(httpStatus.NOT_FOUND, "Plan not found");

  const data: Prisma.SubscriptionPlanUpdateInput = { ...payload };
  if (payload.price != null) data.price = String(payload.price);
  if (payload.name && payload.name !== existing.name) {
    data.slug = payload.slug || slugCreate(payload.name);
  } else if (payload.slug) {
    data.slug = payload.slug;
  }

  return prisma.subscriptionPlan.update({ where: { id }, data });
};

const deletePlan = async (id: string) => {
  await prisma.subscriptionPlan.delete({ where: { id } });
  return { message: "Plan deleted successfully" };
};

const togglePlanStatus = async (id: string) => {
  const existing = await prisma.subscriptionPlan.findUnique({ where: { id } });
  if (!existing) throw new ApiError(httpStatus.NOT_FOUND, "Plan not found");

  return prisma.subscriptionPlan.update({
    where: { id },
    data: { isActive: !existing.isActive },
  });
};

export const SubscriptionPlanServices = {
  createPlan,
  getAllPlans,
  getPlanById,
  updatePlan,
  deletePlan,
  togglePlanStatus,
};
