import type { NextFunction, Request, Response } from "express";
import status from "http-status";
import { pick } from "../../../shared/pick.ts";
import { mainBranchFilterableFields } from "./mainBranch.const.ts";
import catchAsync from "../../shared/catchAsync.ts";
import { MainBranchServices } from "./mainBranch.services.ts";
import sendResponse from "../../utils/response.ts";
import { actorFromReq } from "../../utils/tenant.ts";

const createMainBranch = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user?.id as string;
    const result = await MainBranchServices.createMainBranchIntoDB(
      ownerId,
      req.body,
      actorFromReq(req),
    );
    sendResponse(res, {
      success: true,
      statusCode: status.CREATED,
      message: "Main branch created successfully",
      data: result,
      meta: undefined,
    });
  },
);

const getAllMainBranches = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = pick(req.query, [
      ...mainBranchFilterableFields,
      "page",
      "limit",
      "sortBy",
      "sortOrder",
    ]);
    const result = await MainBranchServices.getAllMainBranches(query, actorFromReq(req));
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Main branches retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  },
);

const getMainBranchById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await MainBranchServices.getMainBranchById(
      id as string,
      actorFromReq(req),
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Main branch retrieved successfully",
      data: result,
    });
  },
);

const updateMainBranch = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await MainBranchServices.updateMainBranch(
      id as string,
      req.body,
      actorFromReq(req),
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Main branch updated successfully",
      data: result,
    });
  },
);

const deleteMainBranch = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await MainBranchServices.deleteMainBranch(
      id as string,
      actorFromReq(req),
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Main branch deleted successfully",
      data: result,
    });
  },
);

const updateMainBranchStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await MainBranchServices.updateMainBranchStatus(
      id as string,
      actorFromReq(req),
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Main branch status updated successfully",
      data: result,
    });
  },
);

export const MainBranchController = {
  createMainBranch,
  getAllMainBranches,
  getMainBranchById,
  updateMainBranch,
  deleteMainBranch,
  updateMainBranchStatus,
};
