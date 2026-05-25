import { Router } from "express";
import { SubBranchController } from "./subBranch.controller.ts";
import validateRequest from "../../middleware/validateRequest.ts";
import { SubBranchValidation } from "./subBranch.validation.ts";
import auth from "../../utils/auth.ts";

const router = Router();

router.post(
  "/",
  auth(),
  validateRequest(SubBranchValidation.createSubBranchZodSchema),
  SubBranchController.createSubBranch,
);
router.get("/", auth(), SubBranchController.getAllSubBranches);
router.get("/:id", auth(), SubBranchController.getSubBranchById);
router.put(
  "/:id",
  auth(),
  validateRequest(SubBranchValidation.updateSubBranchZodSchema),
  SubBranchController.updateSubBranch,
);
router.delete("/:id", auth(), SubBranchController.deleteSubBranch);
router.patch(
  "/:id/status",
  auth(),
  SubBranchController.updateSubBranchStatus,
);

export const SubBranchRouter = router;
