import type { NextFunction, Request, Response } from "express";
import status from "http-status";
import { pick } from "../../../shared/pick.ts";
import { workTypeFilterableFields } from "./workType.const.ts";
import catchAsync from "../../shared/catchAsync.ts";
import { WorkTypeServices } from "./workType.services.ts";
import sendResponse from "../../utils/response.ts";
import { actorFromReq } from "../../utils/tenant.ts";

const createWorkType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await WorkTypeServices.createWorkTypeIntoDB(
      req.body,
      actorFromReq(req),
    );
    sendResponse(res, {
      success: true,
      statusCode: status.CREATED,
      message: "WorkType created successfully",
      data: result,
      meta: undefined,
    });
  },
);

const getAllWorkType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = pick(req.query, workTypeFilterableFields);
    const result = await WorkTypeServices.getAllWorkType(
      query,
      actorFromReq(req),
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "WorkType retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  },
);

const getWorkTypeById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await WorkTypeServices.getWorkTypeById(
      id as string,
      actorFromReq(req),
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "WorkType retrieved successfully",
      data: result,
    });
  },
);

const updateWorkType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await WorkTypeServices.updateWorkType(
      id as string,
      req.body,
      actorFromReq(req),
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "WorkType updated successfully",
      data: result,
    });
  },
);

const deleteWorkType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await WorkTypeServices.deleteWorkType(
      id as string,
      actorFromReq(req),
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "WorkType deleted successfully",
      data: result,
    });
  },
);

const updateWorkTypeStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await WorkTypeServices.updateWorkTypeStatus(
      id as string,
      actorFromReq(req),
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "WorkType status updated successfully",
      data: result,
    });
  },
);

export const WorkTypeController = {
  createWorkType,
  getAllWorkType,
  getWorkTypeById,
  updateWorkType,
  deleteWorkType,
  updateWorkTypeStatus,
};
