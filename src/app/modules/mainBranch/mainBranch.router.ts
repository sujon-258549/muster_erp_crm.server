import { Router } from "express";
import { MainBranchController } from "./mainBranch.controller.ts";
import validateRequest from "../../middleware/validateRequest.ts";
import { MainBranchValidation } from "./mainBranch.validation.ts";
import auth from "../../utils/auth.ts";
import requirePermission from "../../middleware/requirePermission.ts";

const router = Router();

router.post(
  "/",
  auth(),
  requirePermission("branches.list", "create"),
  validateRequest(MainBranchValidation.createMainBranchZodSchema),
  MainBranchController.createMainBranch,
);
router.get(
  "/",
  auth(),
  requirePermission("branches.list", "read"),
  MainBranchController.getAllMainBranches,
);
router.get(
  "/:id",
  auth(),
  requirePermission("branches.list", "read"),
  MainBranchController.getMainBranchById,
);
router.put(
  "/:id",
  auth(),
  requirePermission("branches.list", "update"),
  validateRequest(MainBranchValidation.updateMainBranchZodSchema),
  MainBranchController.updateMainBranch,
);
router.delete(
  "/:id",
  auth(),
  requirePermission("branches.list", "delete"),
  MainBranchController.deleteMainBranch,
);
router.patch(
  "/:id/status",
  auth(),
  requirePermission("branches.list", "update"),
  MainBranchController.updateMainBranchStatus,
);

export const MainBranchRouter = router;
