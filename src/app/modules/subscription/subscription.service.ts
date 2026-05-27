import type { Prisma } from "../../../generated/prisma/client.js";
import httpStatus from "http-status";
import ApiError from "../../middleware/apiError.ts";
import { subscriptionSearchableFields } from "./subscription.constant.ts";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";
import prisma from "../../utils/prismaClient.ts";
import {
  assertTenantAccess,
  isPlatformAdmin,
  tenantFilter,
  type ActorContext,
} from "../../utils/tenant.ts";

// Build the actual Prisma payload from the request body. All template
// data (name, price, cycle, currency) lives on the linked Plan — we only
// persist instance fields here.
const buildInstanceData = (
  payload: any,
): Prisma.SubscriptionUncheckedCreateInput => ({
  branchId: payload.branchId,
  planId: payload.planId,
  startDate: payload.startDate ? new Date(payload.startDate) : null,
  endDate: payload.endDate ? new Date(payload.endDate) : null,
  notes: payload.notes ?? undefined,
  isActive: payload.isActive ?? true,
});

const createSubscription = async (payload: any, actor?: ActorContext) => {
  // Branch admins can only create a subscription for their own branch.
  if (actor && !isPlatformAdmin(actor.role)) {
    if (payload.branchId !== actor.branchId) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "Cannot create a subscription for another branch",
      );
    }
  }
  return prisma.subscription.create({
    data: buildInstanceData(payload),
    include: { plan: true, branch: true },
  });
};

const getAllSubscription = async (query: any, actor?: ActorContext) => {
  const { page, limit, searchTerm, sortBy, sortOrder, ...filter } = query;

  const andCondition: Prisma.SubscriptionWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: subscriptionSearchableFields.map((text: string) => ({
        [text]: { contains: searchTerm, mode: "insensitive" },
      })),
    });
  }

  // Tenant scoping — non-platform users see only their branch's subs.
  if (actor) {
    andCondition.push(tenantFilter(actor) as Prisma.SubscriptionWhereInput);
  }

  const { pageNumber, limitNumber, skip, sortOrderValue, sortByValue } =
    calculatePaginationOrSort(page, limit, sortBy, sortOrder);

  const result = await prisma.subscription.findMany({
    where: { AND: andCondition, ...filter },
    include: { plan: true, branch: true },
    take: limitNumber,
    skip,
    orderBy: { [sortByValue]: sortOrderValue },
  });

  const total = await prisma.subscription.count({
    where: { AND: andCondition, ...filter },
  });

  return {
    data: result,
    meta: { page: pageNumber, limit: limitNumber, total },
  };
};

const getSubscriptionById = async (id: string, actor?: ActorContext) => {
  const result = await prisma.subscription.findFirst({
    where: { id },
    include: { plan: true, branch: true },
  });
  if (!result)
    throw new ApiError(httpStatus.NOT_FOUND, "Subscription not found");
  if (actor) assertTenantAccess(actor, result.branchId);
  return result;
};

const updateSubscription = async (
  id: string,
  payload: any,
  actor?: ActorContext,
) => {
  const existing = await prisma.subscription.findUnique({ where: { id } });
  if (!existing)
    throw new ApiError(httpStatus.NOT_FOUND, "Subscription not found");
  if (actor) {
    assertTenantAccess(actor, existing.branchId);
    if (
      !isPlatformAdmin(actor.role) &&
      payload.branchId &&
      payload.branchId !== existing.branchId
    ) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "Cannot move a subscription to another branch",
      );
    }
  }

  return prisma.subscription.update({
    where: { id },
    data: buildInstanceData(payload),
    include: { plan: true, branch: true },
  });
};

const deleteSubscription = async (id: string, actor?: ActorContext) => {
  const existing = await prisma.subscription.findUnique({ where: { id } });
  if (!existing)
    throw new ApiError(httpStatus.NOT_FOUND, "Subscription not found");
  if (actor) assertTenantAccess(actor, existing.branchId);

  await prisma.subscription.delete({ where: { id } });
  return { message: "Subscription deleted successfully" };
};

const updateSubscriptionStatus = async (id: string, actor?: ActorContext) => {
  const existing = await prisma.subscription.findUnique({ where: { id } });
  if (!existing)
    throw new ApiError(httpStatus.NOT_FOUND, "Subscription not found");
  if (actor) assertTenantAccess(actor, existing.branchId);

  return prisma.subscription.update({
    where: { id },
    data: { isActive: !existing.isActive },
    include: { plan: true, branch: true },
  });
};

export const SubscriptionServices = {
  createSubscription,
  getAllSubscription,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
  updateSubscriptionStatus,
};
