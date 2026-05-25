import type { NextFunction, Request, Response } from "express";
import status from "http-status";
import { pick } from "../../../shared/pick.ts";
import { departmentFilterableFields } from "./department.const.ts";
import catchAsync from "../../shared/catchAsync.ts";
import { DepartmentServices } from "./department.services.ts";
import sendResponse from "../../utils/response.ts";
import { actorFromReq } from "../../utils/tenant.ts";

const createDepartment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await DepartmentServices.createDepartmentIntoDB(
      req.body,
      actorFromReq(req),
    );
    sendResponse(res, {
      success: true,
      statusCode: status.CREATED,
      message: "Department created successfully",
      data: result,
      meta: undefined,
    });
  },
);

const getAllDepartment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = pick(req.query, departmentFilterableFields);
    const result = await DepartmentServices.getAllDepartment(
      query,
      actorFromReq(req),
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Departments retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  },
);

const getDepartmentById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await DepartmentServices.getDepartmentById(
      id as string,
      actorFromReq(req),
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Department retrieved successfully",
      data: result,
    });
  },
);

const updateDepartment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await DepartmentServices.updateDepartment(
      id as string,
      req.body,
      actorFromReq(req),
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Department updated successfully",
      data: result,
    });
  },
);

const deleteDepartment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await DepartmentServices.deleteDepartment(
      id as string,
      actorFromReq(req),
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Department deleted successfully",
      data: result,
    });
  },
);

const updateDepartmentStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await DepartmentServices.updateDepartmentStatus(
      id as string,
      actorFromReq(req),
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Department status updated successfully",
      data: result,
    });
  },
);

export const DepartmentController = {
  createDepartment,
  getAllDepartment,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  updateDepartmentStatus,
};
