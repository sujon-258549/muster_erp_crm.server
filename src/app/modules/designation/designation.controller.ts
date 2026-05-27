import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync.ts";
import sendResponse from "../../utils/response.ts";
import { pick } from "../../../shared/pick.ts";
import { designationFilterableFields } from "./designation.const.ts";
import { DesignationServices } from "./designation.services.ts";
import { actorFromReq } from "../../utils/tenant.ts";

const createDesignation = catchAsync(async (req, res) => {
  const result = await DesignationServices.createDesignation(
    req.body,
    actorFromReq(req),
  );
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Designation created successfully",
    data: result,
  });
});

const getAllDesignations = catchAsync(async (req, res) => {
  const query = pick(req.query, [
    ...designationFilterableFields,
    "page",
    "limit",
    "sortBy",
    "sortOrder",
  ]);
  const result = await DesignationServices.getAllDesignations(
    query,
    actorFromReq(req),
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Designations retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getDesignationById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DesignationServices.getDesignationById(
    id as string,
    actorFromReq(req),
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Designation retrieved successfully",
    data: result,
  });
});

const updateDesignation = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DesignationServices.updateDesignation(
    id as string,
    req.body,
    actorFromReq(req),
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Designation updated successfully",
    data: result,
  });
});

const deleteDesignation = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DesignationServices.deleteDesignation(
    id as string,
    actorFromReq(req),
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Designation deleted successfully",
    data: result,
  });
});

const updateDesignationStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DesignationServices.updateDesignationStatus(
    id as string,
    actorFromReq(req),
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Designation status updated successfully",
    data: result,
  });
});

export const DesignationController = {
  createDesignation,
  getAllDesignations,
  getDesignationById,
  updateDesignation,
  deleteDesignation,
  updateDesignationStatus,
};
