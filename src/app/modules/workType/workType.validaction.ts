import { z } from "zod";

const createWorkTypeZodSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

const updateWorkTypeZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const WorkTypeValidation = {
  createWorkTypeZodSchema,
  updateWorkTypeZodSchema,
};
