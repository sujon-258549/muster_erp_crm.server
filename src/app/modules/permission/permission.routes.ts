import express from "express";
import auth from "../../utils/auth.ts";
import validateRequest from "../../middleware/validateRequest.ts";
import requirePermission from "../../middleware/requirePermission.ts";
import { PermissionControllers } from "./permission.controller.ts";
import { PermissionValidation } from "./permission.validation.ts";

// All endpoints here mutate role-permission rows — gated by the
// `roles.permission` grant. Read endpoints accept `roles.read` so the
// permission modal can hydrate its grid before saving.
const router = express.Router();

router.post(
  "/",
  auth(),
  requirePermission("roles", "permission"),
  validateRequest(PermissionValidation.createPermissionZodSchema),
  PermissionControllers.createPermission,
);
router.get(
  "/",
  auth(),
  requirePermission("roles", "read"),
  PermissionControllers.getAllPermission,
);
router.get(
  "/role/:roleId",
  auth(),
  requirePermission("roles", "read"),
  PermissionControllers.getPermissionsByRole,
);
router.put(
  "/role/:roleId",
  auth(),
  requirePermission("roles", "permission"),
  validateRequest(PermissionValidation.replacePermissionsForRoleZodSchema),
  PermissionControllers.replacePermissionsForRole,
);
router.get(
  "/:id",
  auth(),
  requirePermission("roles", "read"),
  PermissionControllers.getPermissionById,
);
router.put(
  "/:id",
  auth(),
  requirePermission("roles", "permission"),
  validateRequest(PermissionValidation.updatePermissionZodSchema),
  PermissionControllers.updatePermission,
);
router.delete(
  "/:id",
  auth(),
  requirePermission("roles", "permission"),
  PermissionControllers.deletePermission,
);

export const PermissionRoutes = router;
