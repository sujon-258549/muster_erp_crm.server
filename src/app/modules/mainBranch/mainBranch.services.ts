import type { Prisma } from "../../../generated/prisma/client.js";
import ApiError from "../../middleware/apiError.ts";
import httpStatus from "http-status";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";
import { mainBranchSearchableFields } from "./mainBranch.const.ts";
import prisma from "../../utils/prismaClient.ts";
import slugCreate from "../../utils/slugCreate.ts";
import type { ActorContext } from "../../utils/tenant.ts";
import { isPlatformAdmin } from "../../utils/tenant.ts";

const createMainBranchIntoDB = async (
  ownerId: string,
  payload: any,
  actor: ActorContext,
) => {
  const owner = await prisma.user.findUnique({
    where: { id: ownerId },
  });

  if (!owner) {
    throw new ApiError(httpStatus.NOT_FOUND, "Owner user not found");
  }

  // Subscription gate is now Branch-scoped (Subscription has branchId, not
  // userId) — for create-branch we just confirm a non-platform user owns a
  // branch with at least one active subscription. Platform admins bypass.
  if (!isPlatformAdmin(actor.role)) {
    const hasActiveSub = await prisma.subscription.findFirst({
      where: {
        branch: { ownerId },
        isActive: true,
      },
      select: { id: true },
    });
    if (!hasActiveSub) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "Active subscription required to create a branch",
      );
    }
  }

  const slugBase = slugCreate(payload.name);
  let slug = slugBase;
  let counter = 1;
  while (await prisma.mainBranch.findUnique({ where: { slug } })) {
    slug = `${slugBase}-${counter++}`;
  }

  const result = await prisma.mainBranch.create({
    data: {
      ...payload,
      slug,
      ownerId,
    },
  });
  return result;
};

const getAllMainBranches = async (query: any, actor: ActorContext) => {
  const { page, limit, searchTerm, sortBy, sortOrder, ...filter } = query;

  const andCondition: Prisma.MainBranchWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: mainBranchSearchableFields.map((text: string) => ({
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

  const result = await prisma.mainBranch.findMany({
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

  const total = await prisma.mainBranch.count({
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

const getMainBranchById = async (id: string, actor: ActorContext) => {
  const result = await prisma.mainBranch.findUnique({
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
    throw new ApiError(httpStatus.NOT_FOUND, "Main branch not found");
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

const assertMainBranchOwner = async (id: string, actor: ActorContext) => {
  const existing = await prisma.mainBranch.findUnique({ where: { id } });
  if (!existing || existing.isDeleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "Main branch not found");
  }
  if (!isPlatformAdmin(actor.role) && existing.ownerId !== actor.userId) {
    throw new ApiError(httpStatus.FORBIDDEN, "Only branch owner can perform this action");
  }
  return existing;
};

const updateMainBranch = async (id: string, payload: any, actor: ActorContext) => {
  const existing = await assertMainBranchOwner(id, actor);

  const data: Prisma.MainBranchUpdateInput = { ...payload };

  if (payload.name && payload.name !== existing.name) {
    const slugBase = slugCreate(payload.name);
    let slug = slugBase;
    let counter = 1;
    while (
      await prisma.mainBranch.findFirst({
        where: { slug, NOT: { id } },
      })
    ) {
      slug = `${slugBase}-${counter++}`;
    }
    data.slug = slug;
  }

  const result = await prisma.mainBranch.update({
    where: { id },
    data,
  });
  return result;
};

const deleteMainBranch = async (id: string, actor: ActorContext) => {
  await assertMainBranchOwner(id, actor);

  const result = await prisma.mainBranch.update({
    where: { id },
    data: { isDeleted: true, isActive: false },
  });
  return result;
};

const updateMainBranchStatus = async (id: string, actor: ActorContext) => {
  const existing = await assertMainBranchOwner(id, actor);

  const result = await prisma.mainBranch.update({
    where: { id },
    data: { isActive: !existing.isActive },
  });
  return result;
};

export const MainBranchServices = {
  createMainBranchIntoDB,
  getAllMainBranches,
  getMainBranchById,
  updateMainBranch,
  deleteMainBranch,
  updateMainBranchStatus,
};
