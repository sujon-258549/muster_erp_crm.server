import { Router } from "express";
import { DepartmentController } from "./department.controller.ts";
import validateRequest from "../../middleware/validateRequest.ts";
import { DepartmentValidation } from "./department.validation.ts";

import auth from "../../utils/auth.ts";
import { USER_ROLE } from "../users/user.constant.ts";

const router = Router();

router.post(
  "/",
  auth(),
  validateRequest(DepartmentValidation.createDepartmentZodSchema),
  DepartmentController.createDepartment,
);
router.get("/", auth(), DepartmentController.getAllDepartment);
router.get("/:id", auth(), DepartmentController.getDepartmentById);
router.put(
  "/:id",
  auth(),
  validateRequest(DepartmentValidation.updateDepartmentZodSchema),
  DepartmentController.updateDepartment,
);
router.delete("/:id", auth(), DepartmentController.deleteDepartment);
router.patch("/:id/status", auth(), DepartmentController.updateDepartmentStatus);

export const DepartmentRouter = router;
