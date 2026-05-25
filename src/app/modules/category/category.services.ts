import type { Prisma } from "../../../generated/prisma/client.js";
import ApiError from "../../middleware/apiError.ts";
import slugCreate from "../../utils/slugCreate.ts";
import httpStatus from "http-status";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";
import { categorySearchableFields } from "./category.const.ts";
import prisma from "../../utils/prismaClient.ts";
import type { ActorContext } from "../../utils/tenant.ts";
import { tenantFilter, assertTenantAccess } from "../../utils/tenant.ts";

const createCategoryIntoDB = async (payload: any, actor: ActorContext) => {
  const slugBase = payload.slug || slugCreate(payload.name);
  let slug = slugBase;
  let counter = 1;
  while (await prisma.category.findUnique({ where: { slug } })) {
    slug = `${slugBase}-${counter++}`;
  }

  const data: any = {
    name: payload.name,
    icon: payload.icon,
    slug,
    description: payload.description,
    branchId: actor.branchId ?? null,
  };

  if (payload.createdAt) data.createdAt = new Date(payload.createdAt);
  if (payload.updatedAt) data.updatedAt = new Date(payload.updatedAt);

  const result = await prisma.category.create({ data });
  return result;
};

const getAllCategory = async (query: any, actor: ActorContext) => {
  const { page, limit, searchTerm, sortBy, sortOrder, ...filter } = query;

  const andCondition: Prisma.CategoryWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: categorySearchableFields.map((text: string) => ({
        [text]: { contains: searchTerm, mode: "insensitive" },
      })),
    });
  }

  if (filter.status) {
    filter.status = filter.status === "true";
  }

  const { pageNumber, limitNumber, skip, sortOrderValue, sortByValue } =
    calculatePaginationOrSort(page, limit, sortBy, sortOrder);

  const where: Prisma.CategoryWhereInput = {
    AND: andCondition.length > 0 ? andCondition : undefined,
    ...filter,
    ...tenantFilter(actor),
  };

  const result = await prisma.category.findMany({
    where,
    take: limitNumber,
    skip: skip,
    orderBy: { [sortByValue]: sortOrderValue },
    include: {
      subCategories: {
        select: { name: true, icon: true, slug: true, id: true },
      },
    },
  });

  const total = await prisma.category.count({ where });

  return {
    data: result,
    meta: { page: pageNumber, limit: limitNumber, total },
  };
};

const getCategoryById = async (id: string, actor: ActorContext) => {
  const result = await prisma.category.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: {
      subCategories: {
        select: { name: true, icon: true, slug: true, id: true },
      },
    },
  });
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
  assertTenantAccess(actor, result.branchId);
  return result;
};

const updateCategory = async (
  id: string,
  payload: any,
  actor: ActorContext,
) => {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
  assertTenantAccess(actor, existing.branchId);

  const updateData: Partial<Prisma.CategoryUpdateInput> = {};

  if (payload.name) {
    updateData.name = payload.name;
    const slugBase = payload.slug || slugCreate(payload.name);
    let slug = slugBase;
    let counter = 1;
    while (
      await prisma.category.findFirst({ where: { slug, NOT: { id } } })
    ) {
      slug = `${slugBase}-${counter++}`;
    }
    updateData.slug = slug;
  } else if (payload.slug) {
    updateData.slug = payload.slug;
  }

  if (payload.icon) updateData.icon = payload.icon;
  if (payload.status !== undefined)
    updateData.status = payload.status === true || payload.status === "true";
  if (payload.description) updateData.description = payload.description;
  if (payload.createdAt) updateData.createdAt = new Date(payload.createdAt);
  if (payload.updatedAt) updateData.updatedAt = new Date(payload.updatedAt);

  const result = await prisma.category.update({
    where: { id },
    data: updateData,
  });
  return result;
};

const updateCategoryStatus = async (id: string, actor: ActorContext) => {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
  assertTenantAccess(actor, existing.branchId);

  const result = await prisma.category.update({
    where: { id },
    data: { status: !existing.status },
  });
  return result;
};

const deleteCategory = async (id: string, actor: ActorContext) => {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
  assertTenantAccess(actor, existing.branchId);

  const result = await prisma.category.delete({ where: { id } });
  return result;
};

export const CategoryServices = {
  createCategoryIntoDB,
  getAllCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
  updateCategoryStatus,
};
