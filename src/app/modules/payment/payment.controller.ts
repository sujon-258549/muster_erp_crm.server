import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync.ts";
import sendResponse from "../../utils/response.ts";
import { PaymentServices } from "./payment.service.ts";
import { actorFromReq } from "../../utils/tenant.ts";

const createPayment = catchAsync(async (req, res) => {
  // Ensure user is authenticated (middleware should guarantee this)

  const user = req.user;
  const { id } = req.params;

  if (!user) {
    throw new Error("User not found");
  }
  const result = await PaymentServices.createPayment(user.id, id!);
  return sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Payment created successfully!",
    data: result,
  });
});

const validatePayment = catchAsync(async (req, res) => {
  const result = await PaymentServices.validatePayment(req.query as any);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment validated successfully!",
    data: result,
  });
});

const getAllPayment = catchAsync(async (req, res) => {
  const result = await PaymentServices.getAllPayment(actorFromReq(req));
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Payments retrieved successfully!",
    data: result,
  });
});

const getPaymentById = catchAsync(async (req, res) => {
  const result = await PaymentServices.getPaymentById(
    req.params.id!,
    actorFromReq(req),
  );
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment retrieved successfully!",
    data: result,
  });
});

const updatePayment = catchAsync(async (req, res) => {
  const result = await PaymentServices.updatePayment(
    req.params.id!,
    req.body,
    actorFromReq(req),
  );
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment updated successfully!",
    data: result,
  });
});

const deletePayment = catchAsync(async (req, res) => {
  const result = await PaymentServices.deletePayment(
    req.params.id!,
    actorFromReq(req),
  );
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment deleted successfully!",
    data: result,
  });
});

export const PaymentControllers = {
  createPayment,
  getAllPayment,
  getPaymentById,
  updatePayment,
  deletePayment,
  validatePayment,
};
