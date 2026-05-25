import { z } from "zod";

const createDepartmentZodSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
  }),
});

const updateDepartmentZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
  }),
});

export const DepartmentValidation = {
  createDepartmentZodSchema,
  updateDepartmentZodSchema,
};
