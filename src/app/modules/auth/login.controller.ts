import sendResponse from "../../utils/response.ts";
import status from "http-status";
import catchAsync from "../../shared/catchAsync.ts";
import type { NextFunction, Request, Response } from "express";
import { AuthServices } from "./login.services.ts";
import ApiError from "../../middleware/apiError.ts";
import config from "../../config/index.ts";

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await AuthServices.loginUser(payload);
  res.cookie("refreshToken", result.refreshToken, {
    secure: config.nodeEnv === "production",
    httpOnly: true,
    sameSite: config.nodeEnv === "production" ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "User logged in successfully",
    data: result,
  });
});
const createRefreshToken = catchAsync(async (req: Request, res: Response) => {
  const payload = req.cookies.refreshToken || req.body.refreshToken;
  console.log("🔄 [Backend] Refresh Token Received:", payload ? "Yes (Masked)" : "No");
  if (!payload) {
    throw new ApiError(status.BAD_REQUEST, "Refresh token is not provided");
  }
  const result = await AuthServices.refreshToken(payload);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Refresh token generated successfully",
    data: result,
  });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await AuthServices.forgotPassword(payload);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Forgot password email sent successfully",
    data: result,
  });
});
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await AuthServices.resetPassword(
    payload.email,
    payload.password,
    payload.otp,
  );

  res.cookie("refreshToken", result.refreshToken, {
    secure: config.nodeEnv === "production",
    httpOnly: true,
    sameSite: config.nodeEnv === "production" ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Password reset successfully",
    data: result,
  });
});
const logoutUser = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    secure: config.nodeEnv === "production",
    httpOnly: true,
    sameSite: config.nodeEnv === "production" ? "none" : "lax",
  });
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "User logged out successfully",
    data: null,
  });
});

export const AuthController = {
  loginUser,
  createRefreshToken,
  logoutUser,
  forgotPassword,
  resetPassword,
};
