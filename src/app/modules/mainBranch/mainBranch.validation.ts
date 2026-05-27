import { z } from "zod";

const createMainBranchZodSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    logo: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    website: z.string().optional(),
    address: z.string().optional(),
    division: z.string().optional(),
    district: z.string().optional(),
    upazila: z.string().optional(),
    industry: z.string().optional(),
    businessType: z.string().optional(),
    registrationNo: z.string().optional(),
    taxId: z.string().optional(),
    currency: z.string().optional(),
    timezone: z.string().optional(),
  }),
});

const updateMainBranchZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    logo: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    website: z.string().optional(),
    address: z.string().optional(),
    division: z.string().optional(),
    district: z.string().optional(),
    upazila: z.string().optional(),
    industry: z.string().optional(),
    businessType: z.string().optional(),
    registrationNo: z.string().optional(),
    taxId: z.string().optional(),
    currency: z.string().optional(),
    timezone: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const MainBranchValidation = {
  createMainBranchZodSchema,
  updateMainBranchZodSchema,
};
