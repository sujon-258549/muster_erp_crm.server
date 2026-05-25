import { Router } from "express";
import { BranchController } from "./branch.controller.ts";
import validateRequest from "../../middleware/validateRequest.ts";
import { BranchValidation } from "./branch.validation.ts";
import auth from "../../utils/auth.ts";

const router = Router();

router.post(
  "/",
  auth(),
  validateRequest(BranchValidation.createBranchZodSchema),
  BranchController.createBranch,
);
router.get("/", auth(), BranchController.getAllBranches);
router.get("/:id", auth(), BranchController.getBranchById);
router.put(
  "/:id",
  auth(),
  validateRequest(BranchValidation.updateBranchZodSchema),
  BranchController.updateBranch,
);
router.delete("/:id", auth(), BranchController.deleteBranch);
router.patch("/:id/status", auth(), BranchController.updateBranchStatus);

export const BranchRouter = router;
