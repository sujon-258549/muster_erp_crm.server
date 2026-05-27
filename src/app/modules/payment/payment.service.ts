import axios from "axios";
import ApiError from "../../middleware/apiError.ts";
import prisma from "../../utils/prismaClient.js";
import { sslServices, sslValidatePayment } from "../ssl/sslservises.ts";
import status from "http-status";
import config from "../../config/index.ts";
import {
  assertTenantAccess,
  isPlatformAdmin,
  type ActorContext,
} from "../../utils/tenant.ts";

// Payment is linked to a Subscription which carries the branchId. Build
// a where-clause that scopes via the relation.
const tenantWhere = (
  actor?: ActorContext,
): { subscription?: { branchId: string | null } } => {
  if (!actor || isPlatformAdmin(actor.role)) return {};
  return { subscription: { branchId: actor.branchId ?? null } };
};

// Loads a payment with its subscription so we can assert tenant access.
const loadWithBranch = async (id: string) =>
  prisma.payment.findUnique({
    where: { id },
    include: { subscription: { select: { branchId: true } } },
  });

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
    include: { plan: true },
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
    total_amount: existService.plan?.price,
    currency: existService.plan?.currency ?? "BDT",
    tran_id: createTranId, // use unique tran_id for each api call,
    shipping_method: "Courier",
    product_name: existService.plan?.name,
    product_category: existService.plan?.name,
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
      amount: Number(existService.plan?.price ?? 0),
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

const getAllPayment = async (actor?: ActorContext) => {
  const result = await prisma.payment.findMany({
    where: tenantWhere(actor),
    include: { subscription: { include: { plan: true, branch: true } } },
  });
  return { data: result };
};

const getPaymentById = async (id: string, actor?: ActorContext) => {
  const result = await loadWithBranch(id);
  if (!result) throw new ApiError(status.NOT_FOUND, "Payment not found");
  if (actor) assertTenantAccess(actor, result.subscription?.branchId ?? null);
  return result;
};

const updatePayment = async (
  id: string,
  payload: any,
  actor?: ActorContext,
) => {
  const existing = await loadWithBranch(id);
  if (!existing) throw new ApiError(status.NOT_FOUND, "Payment not found");
  if (actor)
    assertTenantAccess(actor, existing.subscription?.branchId ?? null);

  return prisma.payment.update({ where: { id }, data: payload });
};

const deletePayment = async (id: string, actor?: ActorContext) => {
  const existing = await loadWithBranch(id);
  if (!existing) throw new ApiError(status.NOT_FOUND, "Payment not found");
  if (actor)
    assertTenantAccess(actor, existing.subscription?.branchId ?? null);

  await prisma.payment.delete({ where: { id } });
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
