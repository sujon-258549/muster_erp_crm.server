import type { NextFunction, Request, Response } from "express";
import status from "http-status";
import { pick } from "../../../shared/pick.ts";
import { branchFilterableFields } from "./branch.const.ts";
import catchAsync from "../../shared/catchAsync.ts";
import { BranchServices } from "./branch.services.ts";
import sendResponse from "../../utils/response.ts";
import { actorFromReq } from "../../utils/tenant.ts";

const createBranch = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user?.id as string;
    const result = await BranchServices.createBranchIntoDB(
      ownerId,
      req.body,
      actorFromReq(req),
    );
    sendResponse(res, {
      success: true,
      statusCode: status.CREATED,
      message: "Branch created successfully",
      data: result,
      meta: undefined,
    });
  },
);

const getAllBranches = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = pick(req.query, [
      ...branchFilterableFields,
      "page",
      "limit",
      "sortBy",
      "sortOrder",
    ]);
    const result = await BranchServices.getAllBranches(query, actorFromReq(req));
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Branches retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  },
);

const getBranchById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await BranchServices.getBranchById(
      id as string,
      actorFromReq(req),
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Branch retrieved successfully",
      data: result,
    });
  },
);

const updateBranch = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await BranchServices.updateBranch(
      id as string,
      req.body,
      actorFromReq(req),
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Branch updated successfully",
      data: result,
    });
  },
);

const deleteBranch = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await BranchServices.deleteBranch(
      id as string,
      actorFromReq(req),
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Branch deleted successfully",
      data: result,
    });
  },
);

const updateBranchStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await BranchServices.updateBranchStatus(
      id as string,
      actorFromReq(req),
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Branch status updated successfully",
      data: result,
    });
  },
);

export const BranchController = {
  createBranch,
  getAllBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
  updateBranchStatus,
};
