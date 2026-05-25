import type { NextFunction, Request, Response } from "express";
import status from "http-status";
import { pick } from "../../../shared/pick.ts";
import { subBranchFilterableFields } from "./subBranch.const.ts";
import catchAsync from "../../shared/catchAsync.ts";
import { SubBranchServices } from "./subBranch.services.ts";
import sendResponse from "../../utils/response.ts";
import { actorFromReq } from "../../utils/tenant.ts";

const createSubBranch = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await SubBranchServices.createSubBranchIntoDB(
      req.body,
      actorFromReq(req),
    );
    sendResponse(res, {
      success: true,
      statusCode: status.CREATED,
      message: "SubBranch created successfully",
      data: result,
      meta: undefined,
    });
  },
);

const getAllSubBranches = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = pick(req.query, [
      ...subBranchFilterableFields,
      "page",
      "limit",
      "sortBy",
      "sortOrder",
    ]);
    const result = await SubBranchServices.getAllSubBranches(
      query,
      actorFromReq(req),
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "SubBranches retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  },
);

const getSubBranchById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await SubBranchServices.getSubBranchById(
      id as string,
      actorFromReq(req),
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "SubBranch retrieved successfully",
      data: result,
    });
  },
);

const updateSubBranch = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await SubBranchServices.updateSubBranch(
      id as string,
      req.body,
      actorFromReq(req),
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "SubBranch updated successfully",
      data: result,
    });
  },
);

const deleteSubBranch = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await SubBranchServices.deleteSubBranch(
      id as string,
      actorFromReq(req),
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "SubBranch deleted successfully",
      data: result,
    });
  },
);

const updateSubBranchStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await SubBranchServices.updateSubBranchStatus(
      id as string,
      actorFromReq(req),
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "SubBranch status updated successfully",
      data: result,
    });
  },
);

export const SubBranchController = {
  createSubBranch,
  getAllSubBranches,
  getSubBranchById,
  updateSubBranch,
  deleteSubBranch,
  updateSubBranchStatus,
};
