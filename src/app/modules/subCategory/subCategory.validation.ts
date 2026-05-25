import { z } from "zod";

const createSubCategoryZodSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    categoryId: z.string().min(1, "Category ID is required"),
    description: z.string().optional(),
    icon: z.string().optional(),
    slug: z.string().optional(),
    status: z.boolean().optional(),
  }),
});

const updateSubCategoryZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    categoryId: z.string().optional(),
    description: z.string().optional(),
    icon: z.string().optional(),
    slug: z.string().optional(),
    status: z.boolean().optional(),
  }),
});

export const SubCategoryValidation = {
  createSubCategoryZodSchema,
  updateSubCategoryZodSchema,
};
