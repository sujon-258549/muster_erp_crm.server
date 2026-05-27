import type { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.services.js";
import sendResponse from "../../utils/response.js";
import status from "http-status";
import catchAsync from "../../shared/catchAsync.js";
import { pick } from "../../../shared/pick.ts";
import { userFilterableFields } from "./user.constant.ts";
import { actorFromReq } from "../../utils/tenant.ts";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await UserServices.createUserIntoDB(payload);
    sendResponse(res, {
      success: true,
      statusCode: status.CREATED,
      message: "User created successfully",
      data: result,
      meta: undefined,
    });
  },
);

const getUserById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await UserServices.getUserById(
      id as string,
      actorFromReq(req),
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "User fetched successfully",
      data: result,
    });
  },
);

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const query = pick(req.query, userFilterableFields);
  const result = await UserServices.getAllUsers(query, actorFromReq(req));
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "All users fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await UserServices.updateUser(
    id as string,
    payload,
    req.user?.id,
    actorFromReq(req),
  );
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "User updated successfully",
    data: result,
  });
});

const getMyData = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getMyDataAndClearReload(
    req.user?.id as string,
  );
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "My data fetched successfully",
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await UserServices.changePassword(
    payload,
    req.user?.id as string,
  );
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Password changed successfully",
    data: result,
  });
});

const varifyOtp = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await UserServices.varifyOtp(payload.email, payload.otp);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "OTP verified successfully",
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserServices.deleteUser(
    id as string,
    req.user?.id,
    actorFromReq(req),
  );
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "User deleted successfully",
    data: result,
  });
});

const softDeleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserServices.softDeleteUser(
    id as string,
    req.user?.id,
    actorFromReq(req),
  );
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "User soft deleted successfully",
    data: result,
  });
});

const blockUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserServices.blockUser(
    id as string,
    req.user?.id,
    actorFromReq(req),
  );
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "User blocked successfully",
    data: result,
  });
});

export const UserController = {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  getMyData,
  changePassword,
  varifyOtp,
  deleteUser,
  softDeleteUser,
  blockUser,
};
