import { Router } from "express";
import { DesignationController } from "./designation.controller.ts";
import validateRequest from "../../middleware/validateRequest.ts";
import { DesignationValidation } from "./designation.validation.ts";
import auth from "../../utils/auth.ts";
import requirePermission from "../../middleware/requirePermission.ts";

const router = Router();

router.post(
  "/",
  auth(),
  requirePermission("designations", "create"),
  validateRequest(DesignationValidation.createDesignationZodSchema),
  DesignationController.createDesignation,
);
router.get(
  "/",
  auth(),
  requirePermission("designations", "read"),
  DesignationController.getAllDesignations,
);
router.get(
  "/:id",
  auth(),
  requirePermission("designations", "read"),
  DesignationController.getDesignationById,
);
router.put(
  "/:id",
  auth(),
  requirePermission("designations", "update"),
  validateRequest(DesignationValidation.updateDesignationZodSchema),
  DesignationController.updateDesignation,
);
router.delete(
  "/:id",
  auth(),
  requirePermission("designations", "delete"),
  DesignationController.deleteDesignation,
);
router.patch(
  "/:id/status",
  auth(),
  requirePermission("designations", "update"),
  DesignationController.updateDesignationStatus,
);

export const DesignationRouter = router;
