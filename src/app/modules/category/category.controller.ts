import type { NextFunction, Request, Response } from "express";
import status from "http-status";
import { pick } from "../../../shared/pick.ts";
import { categoryFilterableFields } from "./category.const.ts";
import catchAsync from "../../shared/catchAsync.ts";
import { CategoryServices } from "./category.services.ts";
import sendResponse from "../../utils/response.ts";
import { actorFromReq } from "../../utils/tenant.ts";

const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await CategoryServices.createCategoryIntoDB(
      req.body,
      actorFromReq(req),
    );
    sendResponse(res, {
      success: true,
      statusCode: status.CREATED,
      message: "Category created successfully",
      data: result,
      meta: undefined,
    });
  },
);

const getAllCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = pick(req.query, categoryFilterableFields);
    const result = await CategoryServices.getAllCategory(
      query,
      actorFromReq(req),
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Category retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  },
);

const getCategoryById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await CategoryServices.getCategoryById(
      id as string,
      actorFromReq(req),
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Category retrieved successfully",
      data: result,
    });
  },
);

const updateCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await CategoryServices.updateCategory(
      id as string,
      req.body,
      actorFromReq(req),
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Category updated successfully",
      data: result,
    });
  },
);

const updateCategoryStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await CategoryServices.updateCategoryStatus(
      id as string,
      actorFromReq(req),
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Category status updated successfully",
      data: result,
    });
  },
);

const deleteCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await CategoryServices.deleteCategory(
      id as string,
      actorFromReq(req),
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Category deleted successfully",
      data: result,
    });
  },
);

export const CategoryController = {
  createCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
  updateCategoryStatus,
  deleteCategory,
};
