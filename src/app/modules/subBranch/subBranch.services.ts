import type { Prisma } from "../../../generated/prisma/client.js";
import ApiError from "../../middleware/apiError.ts";
import httpStatus from "http-status";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";
import { subBranchSearchableFields } from "./subBranch.const.ts";
import prisma from "../../utils/prismaClient.ts";
import slugCreate from "../../utils/slugCreate.ts";
import type { ActorContext } from "../../utils/tenant.ts";
import { isPlatformAdmin } from "../../utils/tenant.ts";

const assertBranchAccess = async (
  branchId: string | null | undefined,
  actor: ActorContext,
  ownerOnly = false,
) => {
  if (!branchId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Branch is required");
  }
  const branch = await prisma.mainBranch.findUnique({ where: { id: branchId } });
  if (!branch || branch.isDeleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "Branch not found");
  }
  if (isPlatformAdmin(actor.role)) return branch;
  if (ownerOnly) {
    if (branch.ownerId !== actor.userId) {
      throw new ApiError(httpStatus.FORBIDDEN, "Only branch owner can perform this action");
    }
  } else {
    const isOwner = branch.ownerId === actor.userId;
    if (!isOwner) {
      const employee = await prisma.user.findFirst({
        where: { id: actor.userId, branchId: branch.id },
      });
      if (!employee) {
        throw new ApiError(httpStatus.FORBIDDEN, "No access to this branch");
      }
    }
  }
  return branch;
};

const createSubBranchIntoDB = async (payload: any, actor: ActorContext) => {
  const branch = await assertBranchAccess(payload.branchId, actor, true);

  if (payload.managerId) {
    const manager = await prisma.user.findUnique({
      where: { id: payload.managerId },
    });
    if (!manager) {
      throw new ApiError(httpStatus.NOT_FOUND, "Manager user not found");
    }
  }

  const slugBase = slugCreate(`${branch.slug}-${payload.name}`);
  let slug = slugBase;
  let counter = 1;
  while (await prisma.subBranch.findUnique({ where: { slug } })) {
    slug = `${slugBase}-${counter++}`;
  }

  const result = await prisma.subBranch.create({
    data: {
      ...payload,
      slug,
    },
  });
  return result;
};

const getAllSubBranches = async (query: any, actor: ActorContext) => {
  const { page, limit, searchTerm, sortBy, sortOrder, ...filter } = query;

  const andCondition: Prisma.SubBranchWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: subBranchSearchableFields.map((text: string) => ({
        [text]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  // Non-admin: restrict to branches user owns or works in
  if (!isPlatformAdmin(actor.role)) {
    andCondition.push({
      branch: {
        OR: [
          { ownerId: actor.userId },
          { employees: { some: { id: actor.userId } } },
        ],
      },
    });
  }

  const { pageNumber, limitNumber, skip, sortOrderValue, sortByValue } =
    calculatePaginationOrSort(page, limit, sortBy, sortOrder);

  const result = await prisma.subBranch.findMany({
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
      branch: {
        select: { id: true, name: true, slug: true },
      },
      manager: {
        select: { id: true, email: true, mobile: true },
      },
      _count: {
        select: { employees: true },
      },
    },
  });

  const total = await prisma.subBranch.count({
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

const getSubBranchById = async (id: string, actor: ActorContext) => {
  const result = await prisma.subBranch.findUnique({
    where: { id },
    include: {
      branch: true,
      manager: {
        select: { id: true, email: true, mobile: true },
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
    throw new ApiError(httpStatus.NOT_FOUND, "SubBranch not found");
  }

  await assertBranchAccess(result.branchId, actor);

  return result;
};

const updateSubBranch = async (id: string, payload: any, actor: ActorContext) => {
  const existing = await prisma.subBranch.findUnique({
    where: { id },
    include: { branch: true },
  });
  if (!existing || existing.isDeleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "SubBranch not found");
  }

  await assertBranchAccess(existing.branchId, actor, true);

  if (payload.managerId) {
    const manager = await prisma.user.findUnique({
      where: { id: payload.managerId },
    });
    if (!manager) {
      throw new ApiError(httpStatus.NOT_FOUND, "Manager user not found");
    }
  }

  const data: Prisma.SubBranchUpdateInput = { ...payload };

  if (payload.name && payload.name !== existing.name) {
    const slugBase = slugCreate(`${existing.branch?.slug ?? "branch"}-${payload.name}`);
    let slug = slugBase;
    let counter = 1;
    while (
      await prisma.subBranch.findFirst({
        where: { slug, NOT: { id } },
      })
    ) {
      slug = `${slugBase}-${counter++}`;
    }
    data.slug = slug;
  }

  const result = await prisma.subBranch.update({
    where: { id },
    data,
  });
  return result;
};

const deleteSubBranch = async (id: string, actor: ActorContext) => {
  const existing = await prisma.subBranch.findUnique({ where: { id } });
  if (!existing || existing.isDeleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "SubBranch not found");
  }
  await assertBranchAccess(existing.branchId, actor, true);

  const result = await prisma.subBranch.update({
    where: { id },
    data: { isDeleted: true, isActive: false },
  });
  return result;
};

const updateSubBranchStatus = async (id: string, actor: ActorContext) => {
  const existing = await prisma.subBranch.findUnique({ where: { id } });
  if (!existing || existing.isDeleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "SubBranch not found");
  }
  await assertBranchAccess(existing.branchId, actor, true);

  const result = await prisma.subBranch.update({
    where: { id },
    data: { isActive: !existing.isActive },
  });
  return result;
};

export const SubBranchServices = {
  createSubBranchIntoDB,
  getAllSubBranches,
  getSubBranchById,
  updateSubBranch,
  deleteSubBranch,
  updateSubBranchStatus,
};
