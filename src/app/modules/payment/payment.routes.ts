import express from "express";
import { PaymentControllers } from "./payment.controller.ts";
import auth from "../../utils/auth.ts";
import { USER_ROLE } from "../users/user.constant.ts";

const router = express.Router();

// Protected routes - require authentication
router.post(
  "/init-payment/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER),
  PaymentControllers.createPayment,
);

router.post(
  "/validate-payment",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER),
  PaymentControllers.validatePayment,
);
router.get(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  PaymentControllers.getAllPayment,
);
router.get(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  PaymentControllers.getPaymentById,
);
router.put(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  PaymentControllers.updatePayment,
);
router.delete(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  PaymentControllers.deletePayment,
);

export const PaymentRoutes = router;
