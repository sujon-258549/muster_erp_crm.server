import type { Prisma } from "../../../generated/prisma/client.js";
import ApiError from "../../middleware/apiError.ts";
import httpStatus from "http-status";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";
import { branchSearchableFields } from "./branch.const.ts";
import prisma from "../../utils/prismaClient.ts";
import slugCreate from "../../utils/slugCreate.ts";
import type { ActorContext } from "../../utils/tenant.ts";
import { isPlatformAdmin } from "../../utils/tenant.ts";

const createBranchIntoDB = async (
  ownerId: string,
  payload: any,
  actor: ActorContext,
) => {
  const owner = await prisma.user.findUnique({
    where: { id: ownerId },
    include: { subscription: true },
  });

  if (!owner) {
    throw new ApiError(httpStatus.NOT_FOUND, "Owner user not found");
  }

  // Subscription gate applies to tenant users only — platform admins own
  // the system and can spin up branches without a paid plan.
  if (!isPlatformAdmin(actor.role) && !owner.subscriptionId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Active subscription required to create a branch",
    );
  }

  const slugBase = slugCreate(payload.name);
  let slug = slugBase;
  let counter = 1;
  while (await prisma.branch.findUnique({ where: { slug } })) {
    slug = `${slugBase}-${counter++}`;
  }

  const result = await prisma.branch.create({
    data: {
      ...payload,
      slug,
      ownerId,
    },
  });
  return result;
};

const getAllBranches = async (query: any, actor: ActorContext) => {
  const { page, limit, searchTerm, sortBy, sortOrder, ...filter } = query;

  const andCondition: Prisma.BranchWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: branchSearchableFields.map((text: string) => ({
        [text]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  // Non-admins only see branches they own or are an employee of
  if (!isPlatformAdmin(actor.role)) {
    andCondition.push({
      OR: [
        { ownerId: actor.userId },
        { employees: { some: { id: actor.userId } } },
      ],
    });
  }

  const { pageNumber, limitNumber, skip, sortOrderValue, sortByValue } =
    calculatePaginationOrSort(page, limit, sortBy, sortOrder);

  const result = await prisma.branch.findMany({
    where: {
      AND: andCondition.length > 0 ? andCondition : undefined,
      ...filter,
      isDeleted: false,
    },
    take: limitNumber,
    skip: skip,
    orderBy: {
      [sortByValue]: sortOrderValue,
    },
    include: {
      owner: {
        select: {
          id: true,
          email: true,
          mobile: true,
        },
      },
      subBranches: {
        where: { isDeleted: false },
        select: { id: true, name: true, slug: true, isActive: true },
      },
      _count: {
        select: { subBranches: true, employees: true },
      },
    },
  });

  const total = await prisma.branch.count({
    where: {
      AND: andCondition.length > 0 ? andCondition : undefined,
      ...filter,
      isDeleted: false,
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

const getBranchById = async (id: string, actor: ActorContext) => {
  const result = await prisma.branch.findUnique({
    where: { id },
    include: {
      owner: {
        select: { id: true, email: true, mobile: true },
      },
      subBranches: {
        where: { isDeleted: false },
      },
      employees: {
        select: {
          id: true,
          email: true,
          mobile: true,
          roleId: true,
        },
      },
    },
  });

  if (!result || result.isDeleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "Branch not found");
  }

  // Non-admins must own or be an employee
  if (!isPlatformAdmin(actor.role)) {
    const isOwner = result.ownerId === actor.userId;
    const isEmployee = result.employees.some((e) => e.id === actor.userId);
    if (!isOwner && !isEmployee) {
      throw new ApiError(httpStatus.FORBIDDEN, "No access to this branch");
    }
  }

  return result;
};

const assertBranchOwner = async (id: string, actor: ActorContext) => {
  const existing = await prisma.branch.findUnique({ where: { id } });
  if (!existing || existing.isDeleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "Branch not found");
  }
  if (!isPlatformAdmin(actor.role) && existing.ownerId !== actor.userId) {
    throw new ApiError(httpStatus.FORBIDDEN, "Only branch owner can perform this action");
  }
  return existing;
};

const updateBranch = async (id: string, payload: any, actor: ActorContext) => {
  const existing = await assertBranchOwner(id, actor);

  const data: Prisma.BranchUpdateInput = { ...payload };

  if (payload.name && payload.name !== existing.name) {
    const slugBase = slugCreate(payload.name);
    let slug = slugBase;
    let counter = 1;
    while (
      await prisma.branch.findFirst({
        where: { slug, NOT: { id } },
      })
    ) {
      slug = `${slugBase}-${counter++}`;
    }
    data.slug = slug;
  }

  const result = await prisma.branch.update({
    where: { id },
    data,
  });
  return result;
};

const deleteBranch = async (id: string, actor: ActorContext) => {
  await assertBranchOwner(id, actor);

  const result = await prisma.branch.update({
    where: { id },
    data: { isDeleted: true, isActive: false },
  });
  return result;
};

const updateBranchStatus = async (id: string, actor: ActorContext) => {
  const existing = await assertBranchOwner(id, actor);

  const result = await prisma.branch.update({
    where: { id },
    data: { isActive: !existing.isActive },
  });
  return result;
};

export const BranchServices = {
  createBranchIntoDB,
  getAllBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
  updateBranchStatus,
};
