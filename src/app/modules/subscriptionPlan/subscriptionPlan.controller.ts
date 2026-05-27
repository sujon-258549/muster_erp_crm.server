import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync.ts";
import sendResponse from "../../utils/response.ts";
import { SubscriptionPlanServices } from "./subscriptionPlan.service.ts";
import { subscriptionPlanFilterableFields } from "./subscriptionPlan.constant.ts";
import { pick } from "../../../shared/pick.ts";

const createPlan = catchAsync(async (req, res) => {
  const result = await SubscriptionPlanServices.createPlan(req.body);
  return sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Plan created successfully!",
    data: result,
  });
});

const getAllPlans = catchAsync(async (req, res) => {
  const query = pick(req.query, [
    ...subscriptionPlanFilterableFields,
    "page",
    "limit",
    "sortBy",
    "sortOrder",
  ]);
  const result = await SubscriptionPlanServices.getAllPlans(query);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Plans retrieved successfully!",
    data: result.data,
    meta: result.meta,
  });
});

const getPlanById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SubscriptionPlanServices.getPlanById(id as string);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Plan retrieved successfully!",
    data: result,
  });
});

const updatePlan = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SubscriptionPlanServices.updatePlan(id as string, req.body);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Plan updated successfully!",
    data: result,
  });
});

const togglePlanStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SubscriptionPlanServices.togglePlanStatus(id as string);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Plan status updated successfully!",
    data: result,
  });
});

const deletePlan = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SubscriptionPlanServices.deletePlan(id as string);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Plan deleted successfully!",
    data: result,
  });
});

export const SubscriptionPlanControllers = {
  createPlan,
  getAllPlans,
  getPlanById,
  updatePlan,
  togglePlanStatus,
  deletePlan,
};
