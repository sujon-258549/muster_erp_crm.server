import httpStatus from "http-status";
import prisma from "../../utils/prismaClient.ts";
import ApiError from "../../middleware/apiError.ts";
import type { Prisma } from "../../../generated/prisma/client.js";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";
import { commentSearchableFields } from "./comment.constant.ts";
import type { ActorContext } from "../../utils/tenant.ts";
import { tenantFilter, assertTenantAccess } from "../../utils/tenant.ts";

const createComment = async (
  userId: string,
  payload: any,
  actor: ActorContext,
) => {
  const result = await prisma.comment.create({
    data: {
      ...payload,
      userId,
      branchId: actor.branchId ?? null,
    },
    include: {
      user: { include: { profile: true } },
    },
  });
  return result;
};

const getAllComments = async (query: any, actor: ActorContext) => {
  const { searchTerm, page, limit, sortBy, sortOrder, ...queryFilter } = query;

  const andCondition: Prisma.CommentWhereInput[] = [];
  const { pageNumber, limitNumber, skip, sortOrderValue, sortByValue } =
    calculatePaginationOrSort(page, limit, sortBy, sortOrder);

  if (searchTerm) {
    andCondition.push({
      OR: commentSearchableFields.map((text: string) => ({
        [text]: { contains: searchTerm, mode: "insensitive" },
      })),
    });
  }

  const where: Prisma.CommentWhereInput = {
    AND: andCondition.length > 0 ? andCondition : undefined,
    ...queryFilter,
    isDeleted: false,
    ...tenantFilter(actor),
  };

  const result = await prisma.comment.findMany({
    where,
    take: limitNumber,
    skip: skip,
    orderBy: { [sortByValue]: sortOrderValue },
    include: { user: { include: { profile: true } } },
  });

  const total = await prisma.comment.count({ where });

  return {
    data: result,
    meta: { page: pageNumber, limit: limitNumber, total },
  };
};

const getCommentById = async (id: string, actor: ActorContext) => {
  const result = await prisma.comment.findUnique({
    where: { id },
    include: { user: { include: { profile: true } } },
  });
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, "Comment not found");
  assertTenantAccess(actor, result.branchId);
  return result;
};

const updateComment = async (
  id: string,
  payload: any,
  actor: ActorContext,
) => {
  const isExist = await prisma.comment.findUnique({ where: { id } });
  if (!isExist) throw new ApiError(httpStatus.NOT_FOUND, "Comment not found");
  assertTenantAccess(actor, isExist.branchId);

  const result = await prisma.comment.update({ where: { id }, data: payload });
  return result;
};

const deleteComment = async (id: string, actor: ActorContext) => {
  const isExist = await prisma.comment.findUnique({ where: { id } });
  if (!isExist) throw new ApiError(httpStatus.NOT_FOUND, "Comment not found");
  assertTenantAccess(actor, isExist.branchId);

  await prisma.comment.update({
    where: { id },
    data: { isDeleted: true },
  });

  return { message: "Comment deleted successfully" };
};

export const CommentServices = {
  createComment,
  getAllComments,
  getCommentById,
  updateComment,
  deleteComment,
};
