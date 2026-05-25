import { z } from "zod";

const createCommentZodSchema = z.object({
  body: z.object({
    comment: z.string({
      message: "Comment text is required",
    }),
  }),
});

const updateCommentZodSchema = z.object({
  body: z.object({
    comment: z.string().optional(),
    isDeleted: z.boolean().optional(),
    status: z.boolean().optional(),
  }),
});

export const CommentValidation = {
  createCommentZodSchema,
  updateCommentZodSchema,
};
