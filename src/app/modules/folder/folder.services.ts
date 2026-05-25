import type { Prisma } from "../../../generated/prisma/client.js";
import ApiError from "../../middleware/apiError.ts";
import prisma from "../../utils/prismaClient.js";
import slugCreate from "../../utils/slugCreate.ts";
import httpStatus from "http-status";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";
import { folderSearchableFields } from "./folder.const.ts";
import type { ActorContext } from "../../utils/tenant.ts";
import { tenantFilter, assertTenantAccess } from "../../utils/tenant.ts";

const createFolder = async (payload: any, actor: ActorContext) => {
  const slugBase = payload.slug || slugCreate(payload.name);
  let slug = slugBase;
  let counter = 1;
  while (await prisma.folder.findUnique({ where: { slug } })) {
    slug = `${slugBase}-${counter++}`;
  }

  const result = await prisma.folder.create({
    data: {
      ...payload,
      slug,
      branchId: actor.branchId ?? null,
    },
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

const getAllFolders = async (query: any, actor: ActorContext) => {
  const { searchTerm, page, limit, sortBy, sortOrder, ...filter } = query;

  const andCondition: Prisma.FolderWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: folderSearchableFields.map((text: string) => ({
        [text]: { contains: searchTerm, mode: "insensitive" },
      })),
    });
  }

  if (filter.status !== undefined) {
    filter.status = filter.status === "true";
  }

  const rootParentId =
    filter.parentId === "root" ? null : filter.parentId || null;
  delete filter.parentId;

  const { limitNumber, skip, sortOrderValue, sortByValue } =
    calculatePaginationOrSort(page, limit, sortBy, sortOrder);

  const where: Prisma.FolderWhereInput = {
    AND: andCondition.length > 0 ? andCondition : undefined,
    ...filter,
    ...tenantFilter(actor),
  };

  const allFolders = await prisma.folder.findMany({
    where,
    include: {
      images: {
        select: { id: true, name: true, url: true, folderId: true },
      },
    },
    orderBy: { [sortByValue]: sortOrderValue },
  });

  const folderTree = buildFolderTree(allFolders, rootParentId);
  const paginatedFolders = folderTree.slice(skip, skip + limitNumber);

  // Images in root parent — filter by tenant's folders
  const images = await prisma.image.findMany({
    where: {
      folderId: rootParentId,
      folder: tenantFilter(actor),
    },
    select: { url: true, name: true, id: true },
    orderBy: { createdAt: "desc" },
  });

  return {
    data: { folders: paginatedFolders, images },
  };
};

const getFolderById = async (id: string, actor: ActorContext) => {
  const result = await prisma.folder.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: { images: true },
  });
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, "Folder not found");
  assertTenantAccess(actor, result.branchId);

  const allFolders = await prisma.folder.findMany({
    where: tenantFilter(actor),
    include: { images: true },
  });

  return {
    ...result,
    children: buildFolderTree(allFolders, result.id),
  };
};

const updateFolder = async (id: string, payload: any, actor: ActorContext) => {
  const existing = await prisma.folder.findUnique({ where: { id } });
  if (!existing) throw new ApiError(httpStatus.NOT_FOUND, "Folder not found");
  assertTenantAccess(actor, existing.branchId);

  const updateData: Prisma.FolderUpdateInput = { ...payload };

  if (payload.name) {
    updateData.name = payload.name;
    const slugBase = payload.slug || slugCreate(payload.name);
    let slug = slugBase;
    let counter = 1;
    while (await prisma.folder.findFirst({ where: { slug, NOT: { id } } })) {
      slug = `${slugBase}-${counter++}`;
    }
    updateData.slug = slug;
  }

  const result = await prisma.folder.update({ where: { id }, data: updateData });
  return result;
};

const deleteFolder = async (id: string, actor: ActorContext) => {
  const existing = await prisma.folder.findUnique({ where: { id } });
  if (!existing) throw new ApiError(httpStatus.NOT_FOUND, "Folder not found");
  assertTenantAccess(actor, existing.branchId);

  const result = await prisma.folder.delete({ where: { id } });
  return result;
};

export const FolderServices = {
  createFolder,
  getAllFolders,
  getFolderById,
  updateFolder,
  deleteFolder,
};
