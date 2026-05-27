import { Router } from "express";
import { SubBranchController } from "./subBranch.controller.ts";
import validateRequest from "../../middleware/validateRequest.ts";
import { SubBranchValidation } from "./subBranch.validation.ts";
import auth from "../../utils/auth.ts";
import requirePermission from "../../middleware/requirePermission.ts";

const router = Router();

router.post(
  "/",
  auth(),
  requirePermission("subbranches.list", "create"),
  validateRequest(SubBranchValidation.createSubBranchZodSchema),
  SubBranchController.createSubBranch,
);
router.get(
  "/",
  auth(),
  requirePermission("subbranches.list", "read"),
  SubBranchController.getAllSubBranches,
);
router.get(
  "/:id",
  auth(),
  requirePermission("subbranches.list", "read"),
  SubBranchController.getSubBranchById,
);
router.put(
  "/:id",
  auth(),
  requirePermission("subbranches.list", "update"),
  validateRequest(SubBranchValidation.updateSubBranchZodSchema),
  SubBranchController.updateSubBranch,
);
router.delete(
  "/:id",
  auth(),
  requirePermission("subbranches.list", "delete"),
  SubBranchController.deleteSubBranch,
);
router.patch(
  "/:id/status",
  auth(),
  requirePermission("subbranches.list", "update"),
  SubBranchController.updateSubBranchStatus,
);

export const SubBranchRouter = router;
