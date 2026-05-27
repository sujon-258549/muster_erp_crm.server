import express from "express";
import { SubscriptionPlanControllers } from "./subscriptionPlan.controller.ts";
import auth from "../../utils/auth.ts";
import requirePermission from "../../middleware/requirePermission.ts";

const router = express.Router();

router.post(
  "/",
  auth(),
  requirePermission("subscriptions.plans", "create"),
  SubscriptionPlanControllers.createPlan,
);
router.get(
  "/",
  auth(),
  requirePermission("subscriptions.plans", "read"),
  SubscriptionPlanControllers.getAllPlans,
);
router.get(
  "/:id",
  auth(),
  requirePermission("subscriptions.plans", "read"),
  SubscriptionPlanControllers.getPlanById,
);
router.put(
  "/:id",
  auth(),
  requirePermission("subscriptions.plans", "update"),
  SubscriptionPlanControllers.updatePlan,
);
router.patch(
  "/:id/status",
  auth(),
  requirePermission("subscriptions.plans", "update"),
  SubscriptionPlanControllers.togglePlanStatus,
);
router.delete(
  "/:id",
  auth(),
  requirePermission("subscriptions.plans", "delete"),
  SubscriptionPlanControllers.deletePlan,
);

export const SubscriptionPlanRoutes = router;
