import { z } from "zod";

const createSubBranchZodSchema = z.object({
  body: z.object({
    branchId: z.string().min(1, "Branch ID is required"),
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    division: z.string().optional(),
    district: z.string().optional(),
    upazila: z.string().optional(),
    managerId: z.string().optional(),
  }),
});

const updateSubBranchZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    division: z.string().optional(),
    district: z.string().optional(),
    upazila: z.string().optional(),
    managerId: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const SubBranchValidation = {
  createSubBranchZodSchema,
  updateSubBranchZodSchema,
};
