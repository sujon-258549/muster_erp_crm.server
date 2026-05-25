import type { Prisma } from "../../../generated/prisma/client.js";
import httpStatus from "http-status";
import ApiError from "../../middleware/apiError.ts";
import { subscriptionSearchableFields } from "./subscription.constant.ts";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";

import slugCreate from "../../utils/slugCreate.ts";
import prisma from "../../utils/prismaClient.ts";


//create subscription

const createSubscription = async (payload: any) => {
  const slug = payload.slug || slugCreate(payload.name);
  const data = { ...payload, slug };
  return await prisma.subscription.create({ data });
};

//get all subscription

const getAllSubscription = async (query: any) => {
  const { page, limit, searchTerm, sortBy, sortOrder, ...filter } = query;

  const andCondition: Prisma.SubscriptionWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: subscriptionSearchableFields.map((text: string) => ({
        [text]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  const { pageNumber, limitNumber, skip, sortOrderValue, sortByValue } =
    calculatePaginationOrSort(page, limit, sortBy, sortOrder);

  const result = await prisma.subscription.findMany({
    where: {
      AND: andCondition,
      ...filter,
    },
    take: limitNumber,
    skip: skip,
    orderBy: {
      [sortByValue]: sortOrderValue,
    },
  });

  const total = await prisma.subscription.count({
    where: {
      AND: andCondition,
      ...filter,
    },
  });

  return {
    data: result,
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total: total,
    },
  };
};

//get subscription by id

const getSubscriptionById = async (id: string) => {
  const result = await prisma.subscription.findFirst({
    where: { OR: [{ id: id }, { slug: id }] },
  });
  if (!result)
    throw new ApiError(httpStatus.NOT_FOUND, "Subscription not found");
  return result;
};

//update subscription

const updateSubscription = async (id: string, payload: any) => {
  const existingSubscription = await prisma.subscription.findUnique({
    where: { id },
  });
  if (!existingSubscription)
    throw new ApiError(httpStatus.NOT_FOUND, "Subscription not found");

  const updateData = { ...payload };

  if (payload.name) {
    updateData.slug = payload.slug || slugCreate(payload.name);
  } else if (payload.slug) {
    updateData.slug = payload.slug;
  }

  const result = await prisma.subscription.update({
    where: { id },
    data: updateData,
  });
  return result;
};

//delete subscription

const deleteSubscription = async (id: string) => {
  await prisma.subscription.delete({ where: { id } });
  return { message: "Subscription deleted successfully" };
};


//update subscription status
const updateSubscriptionStatus = async (id: string) => {
  const existingSubscription = await prisma.subscription.findUnique({
    where: { id },
  });
  if (!existingSubscription)
    throw new ApiError(httpStatus.NOT_FOUND, "Subscription not found");

  const result = await prisma.subscription.update({
    where: { id },
    data: { status: !existingSubscription.status },
  });
  return result;
};

export const SubscriptionServices = {
  createSubscription,
  getAllSubscription,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
  updateSubscriptionStatus,
};
