import type { Request, Response } from "express";
import { FolderServices } from "./folder.services.ts";
import sendResponse from "../../utils/response.js";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync.js";
import { pick } from "../../../shared/pick.ts";
import { folderFilterableFields } from "./folder.const.ts";
import { actorFromReq } from "../../utils/tenant.ts";

const createFolder = catchAsync(async (req: Request, res: Response) => {
  const result = await FolderServices.createFolder(req.body, actorFromReq(req));
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Folder created successfully",
    data: result,
  });
});

const getAllFolders = catchAsync(async (req: Request, res: Response) => {
  const query = pick(req.query, folderFilterableFields);
  const result = await FolderServices.getAllFolders(query, actorFromReq(req));
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Folders retrieved successfully",
    data: result.data,
  });
});

const getFolderById = catchAsync(async (req: Request, res: Response) => {
  const result = await FolderServices.getFolderById(
    req.params.id as string,
    actorFromReq(req),
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Folder retrieved successfully",
    data: result,
  });
});

const updateFolder = catchAsync(async (req: Request, res: Response) => {
  const result = await FolderServices.updateFolder(
    req.params.id as string,
    req.body,
    actorFromReq(req),
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Folder updated successfully",
    data: result,
  });
});

const deleteFolder = catchAsync(async (req: Request, res: Response) => {
  const result = await FolderServices.deleteFolder(
    req.params.id as string,
    actorFromReq(req),
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Folder deleted successfully",
    data: result,
  });
});

export const FolderController = {
  createFolder,
  getAllFolders,
  getFolderById,
  updateFolder,
  deleteFolder,
};
