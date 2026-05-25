import httpStatus from "http-status";
import prisma from "../../utils/prismaClient.ts";
import ApiError from "../../middleware/apiError.ts";
import slugCreate from "../../utils/slugCreate.ts";
import type { Prisma } from "../../../generated/prisma/client.js";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";
import { blogSearchableFields } from "./blog.constant.ts";
import type { ActorContext } from "../../utils/tenant.ts";
import { tenantFilter, assertTenantAccess } from "../../utils/tenant.ts";

const createBlog = async (payload: any, actor: ActorContext) => {
  const slugBase = payload.slug || slugCreate(payload.title);
  let slug = slugBase;
  let counter = 1;
  while (await prisma.blog.findUnique({ where: { slug } })) {
    slug = `${slugBase}-${counter++}`;
  }
  const data: any = {
    ...payload,
    slug,
    branchId: actor.branchId ?? null,
  };
  if (payload.createdAt) data.createdAt = new Date(payload.createdAt);
  if (payload.updatedAt) data.updatedAt = new Date(payload.updatedAt);

  return await prisma.blog.create({ data });
};

const getAllBlog = async (query: any, actor: ActorContext) => {
  const { searchTerm, page, limit, sortBy, sortOrder, ...queryFilter } = query;

  const andCondition: Prisma.BlogWhereInput[] = [];
  const { pageNumber, limitNumber, skip, sortOrderValue, sortByValue } =
    calculatePaginationOrSort(page, limit, sortBy, sortOrder);

  if (searchTerm) {
    andCondition.push({
      OR: blogSearchableFields.map((text: string) => ({
        [text]: { contains: searchTerm, mode: "insensitive" },
      })),
    });
  }

  if (queryFilter.isPublished !== undefined) {
    queryFilter.isPublished = queryFilter.isPublished === "true";
  }

  const where: Prisma.BlogWhereInput = {
    AND: andCondition.length > 0 ? andCondition : undefined,
    ...queryFilter,
    ...tenantFilter(actor),
  };

  const result = await prisma.blog.findMany({
    where,
    take: limitNumber,
    skip: skip,
    orderBy: { [sortByValue]: sortOrderValue },
  });

  const total = await prisma.blog.count({ where });

  return {
    data: result,
    meta: { page: pageNumber, limit: limitNumber, total },
  };
};

const getBlogById = async (id: string, actor: ActorContext) => {
  const result = await prisma.blog.findFirst({
    where: { OR: [{ id }, { slug: id }] },
  });
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, "Blog not found");
  assertTenantAccess(actor, result.branchId);
  return result;
};

const updateBlog = async (id: string, payload: any, actor: ActorContext) => {
  const existing = await prisma.blog.findUnique({ where: { id } });
  if (!existing) throw new ApiError(httpStatus.NOT_FOUND, "Blog not found");
  assertTenantAccess(actor, existing.branchId);

  const updateData: Partial<Prisma.BlogUpdateInput> = { ...payload };

  if (payload.title) {
    updateData.title = payload.title;
    const slugBase = payload.slug || slugCreate(payload.title);
    let slug = slugBase;
    let counter = 1;
    while (await prisma.blog.findFirst({ where: { slug, NOT: { id } } })) {
      slug = `${slugBase}-${counter++}`;
    }
    updateData.slug = slug;
  } else if (payload.slug) {
    updateData.slug = payload.slug;
  }

  if (payload.createdAt) updateData.createdAt = new Date(payload.createdAt);
  if (payload.updatedAt) updateData.updatedAt = new Date(payload.updatedAt);

  const result = await prisma.blog.update({ where: { id }, data: updateData });
  return result;
};

const updateBlogStatus = async (id: string, actor: ActorContext) => {
  const existing = await prisma.blog.findUnique({ where: { id } });
  if (!existing) throw new ApiError(httpStatus.NOT_FOUND, "Blog not found");
  assertTenantAccess(actor, existing.branchId);

  const result = await prisma.blog.update({
    where: { id },
    data: { isPublished: !existing.isPublished, publishedAt: new Date() },
  });
  return result;
};

const deleteBlog = async (id: string, actor: ActorContext) => {
  const existing = await prisma.blog.findUnique({ where: { id } });
  if (!existing) throw new ApiError(httpStatus.NOT_FOUND, "Blog not found");
  assertTenantAccess(actor, existing.branchId);

  await prisma.blog.delete({ where: { id } });
  return { message: "Blog deleted successfully" };
};

export const BlogServices = {
  createBlog,
  getAllBlog,
  getBlogById,
  updateBlog,
  deleteBlog,
  updateBlogStatus,
};
