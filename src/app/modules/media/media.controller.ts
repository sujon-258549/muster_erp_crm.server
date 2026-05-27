import type { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../utils/response.js";
import { MediaServices } from "./media.service.js";
import { actorFromReq } from "../../utils/tenant.ts";

const createFolder = catchAsync(async (req: Request, res: Response) => {
  const result = await MediaServices.createFolder(req.body, actorFromReq(req));
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Folder created successfully",
    data: result,
  });
});

const getAllFolders = catchAsync(async (req: Request, res: Response) => {
  const result = await MediaServices.getAllFolders(req.query, actorFromReq(req));
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Folders fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getFolderById = catchAsync(async (req: Request, res: Response) => {
  const result = await MediaServices.getFolderById(
    req.params.id as string,
    actorFromReq(req),
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Folder fetched successfully",
    data: result,
  });
});

const updateFolder = catchAsync(async (req: Request, res: Response) => {
  const result = await MediaServices.updateFolder(
    req.params.id as string,
    req.body,
    actorFromReq(req),
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Folder updated successfully",
    data: result,
  });
});

const deleteFolder = catchAsync(async (req: Request, res: Response) => {
  const result = await MediaServices.deleteFolder(
    req.params.id as string,
    actorFromReq(req),
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Folder deleted successfully",
    data: result,
  });
});


// create image============================================
const createImage = catchAsync(async (req: Request, res: Response) => {
  const result = await MediaServices.createImage(req.body, actorFromReq(req));
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Image created successfully",
    data: result,
  });
});

const getImages = catchAsync(async (req: Request, res: Response) => {
  const folderId = (req.query.folderId as string) || "root";
  const result = await MediaServices.getImagesByFolder(
    folderId,
    actorFromReq(req),
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Images fetched successfully",
    data: result,
  });
});

const deleteImage = catchAsync(async (req: Request, res: Response) => {
  const result = await MediaServices.deleteImage(
    req.params.id as string,
    actorFromReq(req),
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Image deleted successfully",
    data: result,
  });
});

const updateImage = catchAsync(async (req: Request, res: Response) => {
  const result = await MediaServices.updateImage(
    req.params.id as string,
    req.body,
    actorFromReq(req),
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Image name updated successfully",
    data: result,
  });
});

export const MediaControllers = {
  createFolder,
  getAllFolders,
  getFolderById,
  updateFolder,
  deleteFolder,
  createImage,
  getImages,
  deleteImage,
  updateImage,
};
