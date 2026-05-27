import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync.ts";
import sendResponse from "../../utils/response.ts";
import { SubscriptionServices } from "./subscription.service.ts";
import { subscriptionFilterableFields } from "./subscription.constant.ts";
import { pick } from "../../../shared/pick.ts";
import { actorFromReq } from "../../utils/tenant.ts";

const createSubscription = catchAsync(async (req, res) => {
  const result = await SubscriptionServices.createSubscription(
    req.body,
    actorFromReq(req),
  );
  return sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Subscription created successfully!",
    data: result,
  });
});

const getAllSubscription = catchAsync(async (req, res) => {
  const query = pick(req.query, subscriptionFilterableFields);
  const result = await SubscriptionServices.getAllSubscription(
    query,
    actorFromReq(req),
  );
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Subscriptions retrieved successfully!",
    data: result.data,
    meta: result.meta,
  });
});

const getSubscriptionById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SubscriptionServices.getSubscriptionById(
    id as string,
    actorFromReq(req),
  );
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subscription retrieved successfully!",
    data: result,
  });
});

const updateSubscription = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SubscriptionServices.updateSubscription(
    id as string,
    req.body,
    actorFromReq(req),
  );
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subscription updated successfully!",
    data: result,
  });
});

const updateSubscriptionStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SubscriptionServices.updateSubscriptionStatus(
    id as string,
    actorFromReq(req),
  );
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subscription status updated successfully!",
    data: result,
  });
});

const deleteSubscription = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SubscriptionServices.deleteSubscription(
    id as string,
    actorFromReq(req),
  );
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subscription deleted successfully!",
    data: result,
  });
});

export const SubscriptionControllers = {
  createSubscription,
  getAllSubscription,
  getSubscriptionById,
  updateSubscription,
  updateSubscriptionStatus,
  deleteSubscription,
};
