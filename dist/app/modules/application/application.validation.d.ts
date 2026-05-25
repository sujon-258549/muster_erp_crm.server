import { z } from "zod";
export declare const ApplicationValidation: {
    createApplicationZodSchema: z.ZodObject<{
        body: z.ZodObject<{
            jobId: z.ZodString;
            resume: z.ZodOptional<z.ZodString>;
            coverLetter: z.ZodOptional<z.ZodString>;
            applyNote: z.ZodOptional<z.ZodString>;
            applyComment: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    updateApplicationZodSchema: z.ZodObject<{
        body: z.ZodObject<{
            applyStatus: z.ZodOptional<z.ZodString>;
            isRead: z.ZodOptional<z.ZodBoolean>;
            isDeleted: z.ZodOptional<z.ZodBoolean>;
            status: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
//# sourceMappingURL=application.validation.d.ts.map