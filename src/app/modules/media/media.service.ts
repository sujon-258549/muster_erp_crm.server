import type { Prisma } from "../../../generated/prisma/client.js";
import ApiError from "../../middleware/apiError.js";
import prisma from "../../utils/prismaClient.js";
import slugCreate from "../../utils/slugCreate.js";
import httpStatus from "http-status";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";
import { mediaSearchableFields } from "./media.const.js";

const createFolder = async (payload: any) => {
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

const getAllFolders = async (query: any) => {
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

  // Get images in this parent
  const images = await prisma.image.findMany({
    where: {
      folderId: rootParentId,
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

const getFolderById = async (id: string) => {
  const result = await prisma.folder.findFirst({
    where: { OR: [{ id: id }, { slug: id }] },
  });
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, "Folder not found");

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

const updateFolder = async (id: string, payload: any) => {
  const existingFolder = await prisma.folder.findUnique({ where: { id } });
  if (!existingFolder)
    throw new ApiError(httpStatus.NOT_FOUND, "Folder not found");

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

const deleteFolder = async (id: string) => {
  const existingFolder = await prisma.folder.findUnique({ where: { id } });
  if (!existingFolder)
    throw new ApiError(httpStatus.NOT_FOUND, "Folder not found");

  // Optional: check for children/images before delete if safety is needed
  // Based on user's new snippet, they removed the check, but it might be safer to keep it.
  // I'll stick to their snippet's simplicity for now but keep it in mind.

  const result = await prisma.folder.delete({ where: { id } });
  return result;
};

// image CRUD =======================================

const createImage = async (payload: {
  name: string;
  url: string;
  folderId?: string;
}) => {
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

const getImagesByFolder = async (folderId: string | null = null) => {
  const result = await prisma.image.findMany({
    where: {
      folderId: folderId === "root" ? null : folderId,
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

const deleteImage = async (id: string) => {
  const existingImage = await prisma.image.findUnique({ where: { id } });
  if (!existingImage)
    throw new ApiError(httpStatus.NOT_FOUND, "Image not found");

  const result = await prisma.image.delete({
    where: { id },
  });
  return result;
};

const updateImage = async (id: string, payload: { name: string }) => {
  const existingImage = await prisma.image.findUnique({ where: { id } });
  if (!existingImage)
    throw new ApiError(httpStatus.NOT_FOUND, "Image not found");

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
