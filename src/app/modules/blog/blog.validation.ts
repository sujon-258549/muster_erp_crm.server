import { z } from "zod";

export const BlogValidation = {
  create: z.object({
    body: z.object({
      title: z.string({ message: "Title is required" }),
      content: z.string({ message: "Content is required" }),
      description: z.string().optional(),
      excerpt: z.string().optional(),
      coverImage: z.string().optional(),
      tags: z.array(z.string()).optional(),
      category: z.string().optional(),
      isPublished: z.boolean().optional(),
    }),
  }),
  update: z.object({
    body: z.object({
      title: z.string().optional(),
      content: z.string().optional(),
      description: z.string().optional(),
      excerpt: z.string().optional(),
      coverImage: z.string().optional(),
      tags: z.array(z.string()).optional(),
      category: z.string().optional(),
      isPublished: z.boolean().optional(),
    }),
  }),
};
