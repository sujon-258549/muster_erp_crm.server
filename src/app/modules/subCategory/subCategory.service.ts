import httpStatus from "http-status";
import ApiError from "../../middleware/apiError.ts";
import prisma from "../../utils/prismaClient.ts";
import type { Prisma } from "../../../generated/prisma/client.js";
import { subCategorySearchableFields } from "./subCategory.constant.ts";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";
import slugCreate from "../../utils/slugCreate.ts";
import {
  assertTenantAccess,
  isPlatformAdmin,
  type ActorContext,
} from "../../utils/tenant.ts";

// SubCategory has no branchId of its own — it inherits from the parent
// Category. Resolve the effective branchId for tenant checks.
const resolveBranchId = async (subCategoryId: string) => {
  const sc = await prisma.subCategory.findUnique({
    where: { id: subCategoryId },
    select: { category: { select: { branchId: true } } },
  });
  return sc?.category?.branchId ?? null;
};

const createSubCategory = async (payload: any, actor?: ActorContext) => {
  // Confirm the chosen parent category belongs to this branch.
  if (actor && payload.categoryId) {
    const parent = await prisma.category.findUnique({
      where: { id: payload.categoryId },
      select: { branchId: true },
    });
    if (!parent) {
      throw new ApiError(httpStatus.NOT_FOUND, "Parent category not found");
    }
    assertTenantAccess(actor, parent.branchId);
  }

  const slug = payload.slug || slugCreate(payload.name);
  const data: any = { ...payload, slug };
  if (payload.createdAt) data.createdAt = new Date(payload.createdAt);
  if (payload.updatedAt) data.updatedAt = new Date(payload.updatedAt);

  const result = await prisma.subCategory.create({ data });
  return result;
};

const getAllSubCategory = async (query: any, actor?: ActorContext) => {
  const { searchTerm, page, limit, sortBy, sortOrder, ...queryFilter } = query;

  const { pageNumber, limitNumber, skip, sortOrderValue, sortByValue } =
    calculatePaginationOrSort(page, limit, sortBy, sortOrder);

  const andCondition: Prisma.SubCategoryWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: subCategorySearchableFields.map((text: string) => ({
        [text]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  // Handle Boolean filter for status
  if (queryFilter.status) {
    queryFilter.status = queryFilter.status === "true";
  }

  // queryFilter
  if (Object.keys(queryFilter).length > 0) {
    andCondition.push({
      AND: Object.keys(queryFilter).map((key: string) => ({
        [key]: {
          equals: queryFilter[key as keyof typeof queryFilter],
        },
      })),
    });
  }

  // Tenant scoping — non-platform users only see sub-categories whose
  // parent Category belongs to their branch.
  if (actor && !isPlatformAdmin(actor.role)) {
    andCondition.push({ category: { branchId: actor.branchId ?? null } });
  }

  const whereCondition: Prisma.SubCategoryWhereInput = {
    AND: andCondition,
  };

  const result = await prisma.subCategory.findMany({
    where: whereCondition,
    include: {
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
    orderBy: {
      [sortByValue]: sortOrderValue,
    },
    skip: skip,
    take: limitNumber,
  });

  const total = await prisma.subCategory.count({
    where: whereCondition,
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

const getSubCategoryById = async (id: string, actor?: ActorContext) => {
  const result = await prisma.subCategory.findFirst({
    where: {
      OR: [{ id: id }, { slug: id }],
    },
    include: {
      category: {
        select: {
          name: true,
          id: true,
          slug: true,
          branchId: true,
        },
      },
    },
  });
  if (!result)
    throw new ApiError(httpStatus.NOT_FOUND, "SubCategory not found");
  if (actor) assertTenantAccess(actor, result.category?.branchId ?? null);
  return result;
};

const getSubCategoryBySlug = async (slug: string) => {
  const result = await prisma.subCategory.findUnique({
    where: { slug },
    include: {
      category: {
        select: {
          name: true,
          id: true,
          slug: true,
        },
      },
    },
  });
  if (!result)
    throw new ApiError(httpStatus.NOT_FOUND, "SubCategory not found");
  return result;
};

const updateSubCategory = async (
  id: string,
  payload: any,
  actor?: ActorContext,
) => {
  const existingSubCategory = await prisma.subCategory.findUnique({
    where: { id },
  });
  if (!existingSubCategory) {
    throw new ApiError(httpStatus.NOT_FOUND, "SubCategory not found");
  }
  if (actor) {
    assertTenantAccess(actor, await resolveBranchId(id));
    // If moving under a new parent category, make sure that one is
    // also inside the caller's branch.
    if (payload.categoryId) {
      const newParent = await prisma.category.findUnique({
        where: { id: payload.categoryId },
        select: { branchId: true },
      });
      if (!newParent) {
        throw new ApiError(httpStatus.NOT_FOUND, "Parent category not found");
      }
      assertTenantAccess(actor, newParent.branchId);
    }
  }

  const updateData: Partial<Prisma.SubCategoryUpdateInput> = {};

  if (payload.name) {
    updateData.name = payload.name;
    updateData.slug = payload.slug || slugCreate(payload.name);
  } else if (payload.slug) {
    updateData.slug = payload.slug;
  }

  if (payload.categoryId) {
    updateData.category = {
      connect: { id: payload.categoryId },
    };
  }
  if (payload.icon) updateData.icon = payload.icon;
  if (payload.description) updateData.description = payload.description;
  if (payload.status !== undefined) {
    updateData.status = payload.status === true || payload.status === "true";
  }
  if (payload.createdAt) updateData.createdAt = new Date(payload.createdAt);
  if (payload.updatedAt) updateData.updatedAt = new Date(payload.updatedAt);

  const result = await prisma.subCategory.update({
    where: { id },
    data: updateData,
  });
  return result;
};

const deleteSubCategory = async (id: string, actor?: ActorContext) => {
  if (actor) assertTenantAccess(actor, await resolveBranchId(id));
  await prisma.subCategory.delete({ where: { id } });
  return { message: "SubCategory deleted successfully" };
};
const updateSubCategoryStatus = async (id: string, actor?: ActorContext) => {
  const existingSubCategory = await prisma.subCategory.findUnique({
    where: { id },
  });
  if (!existingSubCategory)
    throw new ApiError(httpStatus.NOT_FOUND, "SubCategory not found");
  if (actor) assertTenantAccess(actor, await resolveBranchId(id));

  const result = await prisma.subCategory.update({
    where: { id },
    data: { status: !existingSubCategory.status },
  });
  return result;
};

export const SubCategoryServices = {
  createSubCategory,
  getAllSubCategory,
  getSubCategoryById,
  getSubCategoryBySlug,
  updateSubCategory,
  deleteSubCategory,
  updateSubCategoryStatus,
};
