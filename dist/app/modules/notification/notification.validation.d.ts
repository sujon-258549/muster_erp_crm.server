import { z } from "zod";
export declare const NotificationValidation: {
    createNotificationZodSchema: z.ZodObject<{
        body: z.ZodObject<{
            userId: z.ZodString;
            type: z.ZodString;
            message: z.ZodString;
            jobId: z.ZodOptional<z.ZodString>;
            applicationId: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    updateNotificationZodSchema: z.ZodObject<{
        body: z.ZodObject<{
            isRead: z.ZodOptional<z.ZodBoolean>;
            isDeleted: z.ZodOptional<z.ZodBoolean>;
            status: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
//# sourceMappingURL=notification.validation.d.ts.map