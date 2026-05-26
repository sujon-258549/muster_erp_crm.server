import { Router } from "express";
import { DepartmentController } from "./department.controller.ts";
import validateRequest from "../../middleware/validateRequest.ts";
import { DepartmentValidation } from "./department.validation.ts";
import auth from "../../utils/auth.ts";
import requirePermission from "../../middleware/requirePermission.ts";

const router = Router();

router.post(
  "/",
  auth(),
  requirePermission("departments", "create"),
  validateRequest(DepartmentValidation.createDepartmentZodSchema),
  DepartmentController.createDepartment,
);
router.get(
  "/",
  auth(),
  requirePermission("departments", "read"),
  DepartmentController.getAllDepartment,
);
router.get(
  "/:id",
  auth(),
  requirePermission("departments", "read"),
  DepartmentController.getDepartmentById,
);
router.put(
  "/:id",
  auth(),
  requirePermission("departments", "update"),
  validateRequest(DepartmentValidation.updateDepartmentZodSchema),
  DepartmentController.updateDepartment,
);
router.delete(
  "/:id",
  auth(),
  requirePermission("departments", "delete"),
  DepartmentController.deleteDepartment,
);
router.patch(
  "/:id/status",
  auth(),
  requirePermission("departments", "update"),
  DepartmentController.updateDepartmentStatus,
);

export const DepartmentRouter = router;
