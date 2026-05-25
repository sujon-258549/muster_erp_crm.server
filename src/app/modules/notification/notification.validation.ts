import { z } from "zod";

const createNotificationZodSchema = z.object({
  body: z.object({
    userId: z.string({
      message: "User ID is required",
    }),
    type: z.string({
      message: "Type is required",
    }),
    message: z.string({
      message: "Message is required",
    }),
  }),
});

const updateNotificationZodSchema = z.object({
  body: z.object({
    isRead: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
    status: z.boolean().optional(),
  }),
});

export const NotificationValidation = {
  createNotificationZodSchema,
  updateNotificationZodSchema,
};
