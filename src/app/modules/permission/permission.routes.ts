import express from "express";
import auth from "../../utils/auth.ts";
import validateRequest from "../../middleware/validateRequest.ts";
import { PermissionControllers } from "./permission.controller.ts";
import { PermissionValidation } from "./permission.validation.ts";

const router = express.Router();

router.post(
  "/",
  auth(),
  validateRequest(PermissionValidation.createPermissionZodSchema),
  PermissionControllers.createPermission,
);
router.get("/", auth(), PermissionControllers.getAllPermission);
router.get("/role/:roleId", auth(), PermissionControllers.getPermissionsByRole);
router.get("/:id", auth(), PermissionControllers.getPermissionById);
router.put(
  "/:id",
  auth(),
  validateRequest(PermissionValidation.updatePermissionZodSchema),
  PermissionControllers.updatePermission,
);
router.delete("/:id", auth(), PermissionControllers.deletePermission);

export const PermissionRoutes = router;
