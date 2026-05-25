import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync.ts";
import sendResponse from "../../utils/response.ts";
import { NotificationServices } from "./notification.service.ts";
import { pick } from "../../../shared/pick.ts";
import { notificationFilterableFields } from "./notification.constant.ts";
import { actorFromReq } from "../../utils/tenant.ts";

const createNotification = catchAsync(async (req, res) => {
  const result = await NotificationServices.createNotification(
    req.body,
    actorFromReq(req),
  );
  return sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Notification created successfully!",
    data: result,
  });
});

const getAllNotifications = catchAsync(async (req, res) => {
  const query = pick(req.query, notificationFilterableFields);
  const result = await NotificationServices.getAllNotifications(
    query,
    actorFromReq(req),
  );
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notifications retrieved successfully!",
    data: result.data,
    meta: result.meta,
  });
});

const getNotificationById = catchAsync(async (req, res) => {
  const result = await NotificationServices.getNotificationById(
    req.params.id as string,
    actorFromReq(req),
  );
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notification retrieved successfully!",
    data: result,
  });
});

const updateNotification = catchAsync(async (req, res) => {
  const result = await NotificationServices.updateNotification(
    req.params.id as string,
    req.body,
    actorFromReq(req),
  );
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notification updated successfully!",
    data: result,
  });
});

const deleteNotification = catchAsync(async (req, res) => {
  const result = await NotificationServices.deleteNotification(
    req.params.id as string,
    actorFromReq(req),
  );
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notification deleted successfully!",
    data: result,
  });
});

const markAsRead = catchAsync(async (req, res) => {
  const userId = req.user?.id as string;
  const result = await NotificationServices.markAsRead(userId);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notifications marked as read!",
    data: result,
  });
});

export const NotificationControllers = {
  createNotification,
  getAllNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification,
  markAsRead,
};
