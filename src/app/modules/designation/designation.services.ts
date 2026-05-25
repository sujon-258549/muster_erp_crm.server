import type { Prisma } from "../../../generated/prisma/client.js";
import ApiError from "../../middleware/apiError.ts";
import httpStatus from "http-status";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";
import { designationSearchableFields } from "./designation.const.ts";
import prisma from "../../utils/prismaClient.ts";
import slugCreate from "../../utils/slugCreate.ts";

const createDesignation = async (payload: any) => {
  const slug = payload.slug || slugCreate(payload.name);

  const exists = await prisma.designation.findFirst({
    where: { OR: [{ name: payload.name }, { slug }] },
  });
  if (exists) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Designation already exists");
  }

  const result = await prisma.designation.create({
    data: {
      name: payload.name,
      slug,
      description: payload.description,
      isActive: payload.isActive ?? true,
    },
  });
  return result;
};

const getAllDesignations = async (query: any) => {
  const { page, limit, searchTerm, sortBy, sortOrder, ...filter } = query;

  const andCondition: Prisma.DesignationWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: designationSearchableFields.map((field: string) => ({
        [field]: { contains: searchTerm, mode: "insensitive" },
      })),
    });
  }

  if (filter.isActive !== undefined) {
    filter.isActive = filter.isActive === "true" || filter.isActive === true;
  }

  if (Object.keys(filter).length > 0) {
    andCondition.push({
      AND: Object.keys(filter).map((key) => ({
        [key]: { equals: filter[key as keyof typeof filter] },
      })),
    });
  }

  const { pageNumber, limitNumber, skip, sortOrderValue, sortByValue } =
    calculatePaginationOrSort(page, limit, sortBy, sortOrder);

  const where: Prisma.DesignationWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const data = await prisma.designation.findMany({
    where,
    take: limitNumber,
    skip,
    orderBy: { [sortByValue]: sortOrderValue },
  });

  const total = await prisma.designation.count({ where });

  return {
    data,
    meta: { page: pageNumber, limit: limitNumber, total },
  };
};

const getDesignationById = async (id: string) => {
  const result = await prisma.designation.findUnique({ where: { id } });
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, "Designation not found");
  return result;
};

const updateDesignation = async (id: string, payload: any) => {
  const existing = await prisma.designation.findUnique({ where: { id } });
  if (!existing) throw new ApiError(httpStatus.NOT_FOUND, "Designation not found");

  const data: any = {};
  if (payload.name !== undefined) {
    data.name = payload.name;
    data.slug = slugCreate(payload.name);
  }
  if (payload.description !== undefined) data.description = payload.description;
  if (payload.isActive !== undefined) data.isActive = payload.isActive;

  const result = await prisma.designation.update({ where: { id }, data });
  return result;
};

const deleteDesignation = async (id: string) => {
  const existing = await prisma.designation.findUnique({ where: { id } });
  if (!existing) throw new ApiError(httpStatus.NOT_FOUND, "Designation not found");
  await prisma.designation.delete({ where: { id } });
  return { message: "Designation deleted successfully" };
};

const updateDesignationStatus = async (id: string) => {
  const existing = await prisma.designation.findUnique({ where: { id } });
  if (!existing) throw new ApiError(httpStatus.NOT_FOUND, "Designation not found");
  const result = await prisma.designation.update({
    where: { id },
    data: { isActive: !existing.isActive },
  });
  return result;
};

export const DesignationServices = {
  createDesignation,
  getAllDesignations,
  getDesignationById,
  updateDesignation,
  deleteDesignation,
  updateDesignationStatus,
};
