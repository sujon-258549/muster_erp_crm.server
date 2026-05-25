import { Router } from "express";
import { DesignationController } from "./designation.controller.ts";
import validateRequest from "../../middleware/validateRequest.ts";
import { DesignationValidation } from "./designation.validation.ts";
import auth from "../../utils/auth.ts";

const router = Router();

router.post(
  "/",
  auth(),
  validateRequest(DesignationValidation.createDesignationZodSchema),
  DesignationController.createDesignation,
);
router.get("/", auth(), DesignationController.getAllDesignations);
router.get("/:id", auth(), DesignationController.getDesignationById);
router.put(
  "/:id",
  auth(),
  validateRequest(DesignationValidation.updateDesignationZodSchema),
  DesignationController.updateDesignation,
);
router.delete("/:id", auth(), DesignationController.deleteDesignation);
router.patch("/:id/status", auth(), DesignationController.updateDesignationStatus);

export const DesignationRouter = router;
