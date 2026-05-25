import axios from "axios";
import ApiError from "../../middleware/apiError.ts";
import prisma from "../../utils/prismaClient.js";
import { sslServices, sslValidatePayment } from "../ssl/sslservises.ts";
import status from "http-status";
import config from "../../config/index.ts";

const createPayment = async (userId: string, id: string) => {
  const existUser = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    include: {
      profile: true,
      address: true,
    },
  });

  if (!existUser) {
    throw new ApiError(status.UNAUTHORIZED, "User not found");
  }

  const existService = await prisma.subscription.findUniqueOrThrow({
    where: {
      id: id,
    },
  });

  if (!existService) {
    throw new ApiError(status.UNAUTHORIZED, "Service not found");
  }

  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const lastPayment = await prisma.payment.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });

  let incrementId = 0;

  if (lastPayment?.transactionId) {
    const lastId = lastPayment.transactionId.split("-").pop();
    if (lastId) {
      incrementId = parseInt(lastId);
    }
  }

  const createTranId = `TRAN-${year}${month}-${incrementId + 1}`;

  const data = {
    total_amount: existService.price,
    currency: "BDT",
    tran_id: createTranId, // use unique tran_id for each api call,
    shipping_method: "Courier",
    product_name: existService.name,
    product_category: existService.name,
    product_profile: "general",
    cus_name: existUser?.profile?.name,
    cus_email: existUser.email,
    cus_phone: existUser?.mobile,
    cus_fax: existUser?.mobile,
    ship_name: existUser?.profile?.name,
    cus_add1: existUser?.address?.address,
    cus_add2: existUser?.address?.district,
    cus_city: existUser?.address?.district,
    cus_state: existUser?.address?.division,
    cus_postcode: "1000",
    cus_country: "Bangladesh",
  };

  const createPayment = await prisma.payment.create({
    data: {
      transactionId: createTranId,
      amount: Number(existService.price),
      status: "PENDING",
      userId: existUser.id,
      subscriptionId: existService.id,
      paymentGatewayData: data,
      paymentMethod: "SSL",
      
    },
  });

  const paymentUrl = await sslServices.createPayment(data);

  return {
    paymentUrl,
    createPayment,
  };
};

const validatePayment = async (payload: any) => {
  if (!payload || !payload.status || payload.status !== "VALID") {
    // throw new ApiError(status.UNAUTHORIZED, "Payment validation failed");
    return {
      message: "Payment validation failed",
      data: payload,
    };
  }

  const response = await sslValidatePayment(payload);

  if (response.data.status !== "VALID") {
    return {
      message: "Payment validation failed",
      data: response.data,
    };
  }

  return {
    message: "Payment validation successful",
    data: response.data,
  };
};

const getAllPayment = async () => {
  const result = await prisma.payment.findMany({});
  return {
    data: result,
  };
};

const getPaymentById = async (id: string) => {
  const result = await prisma.payment.findUnique({
    where: { id },
  });
  return result;
};

const updatePayment = async (id: string, payload: any) => {
  const result = await prisma.payment.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deletePayment = async (id: string) => {
  await prisma.payment.delete({
    where: { id },
  });
  return { message: "Payment deleted successfully" };
};

export const PaymentServices = {
  createPayment,
  getAllPayment,
  getPaymentById,
  updatePayment,
  deletePayment,
  validatePayment,
};
