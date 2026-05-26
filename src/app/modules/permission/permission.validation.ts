import { z } from "zod";

const createPermissionZodSchema = z.object({
  body: z.object({
    roleId: z.string().min(1, "roleId is required"),
    module: z.string().min(1, "module is required"),
    permissions: z.array(z.string()).default([]),
  }),
});

const updatePermissionZodSchema = z.object({
  body: z.object({
    roleId: z.string().optional(),
    module: z.string().optional(),
    permissions: z.array(z.string()).optional(),
  }),
});

// Whole-role bulk sync — used by the role-permission modal's Save button.
const replacePermissionsForRoleZodSchema = z.object({
  body: z.object({
    permissions: z.array(
      z.object({
        module: z.string().min(1),
        permissions: z.array(z.string()),
      }),
    ),
  }),
});

export const PermissionValidation = {
  createPermissionZodSchema,
  updatePermissionZodSchema,
  replacePermissionsForRoleZodSchema,
};
