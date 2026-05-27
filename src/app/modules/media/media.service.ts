import type { Prisma } from "../../../generated/prisma/client.js";
import ApiError from "../../middleware/apiError.js";
import prisma from "../../utils/prismaClient.js";
import slugCreate from "../../utils/slugCreate.js";
import httpStatus from "http-status";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";
import { mediaSearchableFields } from "./media.const.js";
import {
  assertTenantAccess,
  isPlatformAdmin,
  tenantFilter,
  type ActorContext,
} from "../../utils/tenant.ts";

const createFolder = async (payload: any, actor?: ActorContext) => {
  // Force-scope a non-platform user's new folder to their own branch.
  if (actor && !isPlatformAdmin(actor.role)) {
    payload.branchId = actor.branchId ?? null;
  }
  const slug = payload.slug || slugCreate(payload.name + Math.floor(Math.random() * 1000));
  const data: Prisma.FolderCreateInput = {
    ...payload,
    slug,
  };

  const result = await prisma.folder.create({
    data,
  });
  return result;
};

const buildFolderTree = (
  folders: any[],
  parentId: string | null = null,
): any[] => {
  return folders
    .filter((folder) => folder.parentId === parentId)
    .map((folder) => ({
      ...folder,
      children: buildFolderTree(folders, folder.id),
    }));
};

const getAllFolders = async (query: any, actor?: ActorContext) => {
  const { searchTerm, page, limit, sortBy, sortOrder, ...filter } = query;

  const andCondition: Prisma.FolderWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: mediaSearchableFields.map((text: string) => ({
        [text]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (actor) {
    andCondition.push(tenantFilter(actor) as Prisma.FolderWhereInput);
  }

  if (filter.status !== undefined) {
    filter.status = filter.status === "true";
  }

  // Handle parentId grouping logic
  const rootParentId =
    filter.parentId === "root" ? null : filter.parentId || null;
  delete filter.parentId;

  const { pageNumber, limitNumber, skip, sortOrderValue, sortByValue } =
    calculatePaginationOrSort(page, limit, sortBy, sortOrder);

  // Fetch ALL folders matching the condition to build the tree
  const allFolders = await prisma.folder.findMany({
    where: {
      AND: andCondition.length > 0 ? andCondition : undefined,
      ...filter,
    },
    include: {
      _count: {
        select: {
          children: true,
          images: true,
        },
      },
    },
    orderBy: {
      [sortByValue]: sortOrderValue,
    },
  });

  // Build the tree
  const folderTree = buildFolderTree(allFolders, rootParentId);

  // Apply pagination to the root level of the tree
  const paginatedFolders = folderTree.slice(skip, skip + limitNumber);

  // Get images in this parent (scope to actor's branch too).
  const images = await prisma.image.findMany({
    where: {
      folderId: rootParentId,
      ...(actor && !isPlatformAdmin(actor.role)
        ? { branchId: actor.branchId ?? null }
        : {}),
    },
    select: {
      id: true,
      name: true,
      url: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total: folderTree.length,
    },
    data: {
      folders: paginatedFolders,
      images,
    },
  };
};

const getFolderById = async (id: string, actor?: ActorContext) => {
  const result = await prisma.folder.findFirst({
    where: { OR: [{ id: id }, { slug: id }] },
  });
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, "Folder not found");
  if (actor) assertTenantAccess(actor, result.branchId);

  // Fetch all folders to build the tree for this parent
  const allFolders = await prisma.folder.findMany({
    include: {
      _count: {
        select: {
          children: true,
          images: true,
        },
      },
    },
  });

  const folderWithTree = {
    ...result,
    children: buildFolderTree(allFolders, result.id),
    images: await prisma.image.findMany({
      where: { folderId: result.id },
      select: {
        id: true,
        name: true,
        url: true,
      },
    }),
  };

  return folderWithTree;
};

const updateFolder = async (id: string, payload: any, actor?: ActorContext) => {
  const existingFolder = await prisma.folder.findUnique({ where: { id } });
  if (!existingFolder)
    throw new ApiError(httpStatus.NOT_FOUND, "Folder not found");
  if (actor) assertTenantAccess(actor, existingFolder.branchId);

  const updateData: Prisma.FolderUpdateInput = { ...payload };

  if (payload.name) {
    updateData.name = payload.name;
    updateData.slug = payload.slug || slugCreate(payload.name);
  }

  const result = await prisma.folder.update({
    where: { id },
    data: updateData,
  });
  return result;
};

const deleteFolder = async (id: string, actor?: ActorContext) => {
  const existingFolder = await prisma.folder.findUnique({ where: { id } });
  if (!existingFolder)
    throw new ApiError(httpStatus.NOT_FOUND, "Folder not found");
  if (actor) assertTenantAccess(actor, existingFolder.branchId);

  const result = await prisma.folder.delete({ where: { id } });
  return result;
};

// image CRUD =======================================

const createImage = async (
  payload: {
    name: string;
    url: string;
    folderId?: string;
  },
  actor?: ActorContext,
) => {
  // Image itself has no branchId — its tenant scope is inherited from
  // the folder it sits in. Enforce the actor's branch by validating the
  // chosen folder belongs to them.
  if (actor && !isPlatformAdmin(actor.role)) {
    if (!payload.folderId) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Folder is required for image upload",
      );
    }
    const folder = await prisma.folder.findUnique({
      where: { id: payload.folderId },
      select: { branchId: true },
    });
    if (!folder) throw new ApiError(httpStatus.NOT_FOUND, "Folder not found");
    assertTenantAccess(actor, folder.branchId);
  }

  const slug = slugCreate(payload.name + "-" + Math.floor(Math.random() * 10000));
  const result = await prisma.image.create({
    data: {
      name: payload.name,
      url: payload.url,
      slug: slug,
      folderId: payload.folderId || null,
    },
  });
  return result;
};

const getImagesByFolder = async (
  folderId: string | null = null,
  actor?: ActorContext,
) => {
  const normalizedFolderId = folderId === "root" ? null : folderId;

  const result = await prisma.image.findMany({
    where: {
      folderId: normalizedFolderId,
      // Scope through the folder relation since Image has no branchId.
      ...(actor && !isPlatformAdmin(actor.role)
        ? { folder: { branchId: actor.branchId ?? null } }
        : {}),
    },
    select: {
      id: true,
      name: true,
      url: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

// Load image with its folder's branchId so tenant access can be asserted.
const loadImageWithBranch = async (id: string) =>
  prisma.image.findUnique({
    where: { id },
    include: { folder: { select: { branchId: true } } },
  });

const deleteImage = async (id: string, actor?: ActorContext) => {
  const existingImage = await loadImageWithBranch(id);
  if (!existingImage)
    throw new ApiError(httpStatus.NOT_FOUND, "Image not found");
  if (actor) assertTenantAccess(actor, existingImage.folder?.branchId ?? null);

  const result = await prisma.image.delete({
    where: { id },
  });
  return result;
};

const updateImage = async (
  id: string,
  payload: { name: string },
  actor?: ActorContext,
) => {
  const existingImage = await loadImageWithBranch(id);
  if (!existingImage)
    throw new ApiError(httpStatus.NOT_FOUND, "Image not found");
  if (actor) assertTenantAccess(actor, existingImage.folder?.branchId ?? null);

  const slug = slugCreate(payload.name);

  const result = await prisma.image.update({
    where: { id },
    data: {
      name: payload.name,
      slug,
    },
  });
  return result;
};

export const MediaServices = {
  createFolder,
  getAllFolders,
  getFolderById,
  deleteFolder,
  updateFolder,
  createImage,
  getImagesByFolder,
  deleteImage,
  updateImage,
};
