import httpStatus from "http-status";
import { SubCategoryServices } from "./subCategory.service.ts";
import sendResponse from "../../utils/response.ts";
import catchAsync from "../../shared/catchAsync.ts";
import { pick } from "../../../shared/pick.ts";
import { actorFromReq } from "../../utils/tenant.ts";
import { subCategoryFilterableFields } from "./subCategory.constant.ts";

const createSubCategory = catchAsync(async (req, res) => {
  const result = await SubCategoryServices.createSubCategory(req.body, actorFromReq(req));
  return sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "SubCategory created successfully!",
    data: result,
  });
});

const getAllSubCategory = catchAsync(async (req, res) => {

  const queryOptions = pick(req.query, subCategoryFilterableFields);

  const result = await SubCategoryServices.getAllSubCategory(queryOptions, actorFromReq(req));
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All SubCategorys retrieved successfully!",
    data: result.data,
    meta: result.meta,
  });
});

const getSubCategoryById = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await SubCategoryServices.getSubCategoryById(id as string, actorFromReq(req));
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "SubCategory retrieved successfully!",
    data: result,
  });
});

const getSubCategoryBySlug = catchAsync(async (req, res) => {
  const slug = req.params.slug;
  const result = await SubCategoryServices.getSubCategoryBySlug(slug as string);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "SubCategory retrieved successfully!",
    data: result,
  });
});

const updateSubCategory = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await SubCategoryServices.updateSubCategory(
    id as string,
    req.body,
    actorFromReq(req),
  );
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "SubCategory updated successfully!",
    data: result,
  });
});

const deleteSubCategory = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await SubCategoryServices.deleteSubCategory(
    id as string,
    actorFromReq(req),
  );
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "SubCategory deleted successfully!",
    data: result,
  });
});

const updateSubCategoryStatus = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await SubCategoryServices.updateSubCategoryStatus(
    id as string,
    actorFromReq(req),
  );
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "SubCategory status updated successfully!",
    data: result,
  });
});

export const SubCategoryControllers = {
  createSubCategory,
  getAllSubCategory,
  getSubCategoryById,
  getSubCategoryBySlug,
  updateSubCategory,
  deleteSubCategory,
  updateSubCategoryStatus,
};
