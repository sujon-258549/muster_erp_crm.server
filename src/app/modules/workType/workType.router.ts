import { Router } from "express";
import { WorkTypeController } from "./workType.controller.ts";
import validateRequest from "../../middleware/validateRequest.ts";
import { WorkTypeValidation } from "./workType.validaction.ts";

import auth from "../../utils/auth.ts";

const router = Router();

router.post(
  "/",
  auth(),
  validateRequest(WorkTypeValidation.createWorkTypeZodSchema),
  WorkTypeController.createWorkType
);
router.get("/", auth(), WorkTypeController.getAllWorkType);
router.get("/:id", auth(), WorkTypeController.getWorkTypeById);
router.put(
  "/:id",
  auth(),
  validateRequest(WorkTypeValidation.updateWorkTypeZodSchema),
  WorkTypeController.updateWorkType
);
router.patch("/:id/status", auth(), WorkTypeController.updateWorkTypeStatus);
router.delete("/:id", auth(), WorkTypeController.deleteWorkType);

export const WorkTypeRouter = router;
