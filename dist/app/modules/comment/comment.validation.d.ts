import { z } from "zod";
export declare const CommentValidation: {
    createCommentZodSchema: z.ZodObject<{
        body: z.ZodObject<{
            applicationId: z.ZodString;
            comment: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    updateCommentZodSchema: z.ZodObject<{
        body: z.ZodObject<{
            comment: z.ZodOptional<z.ZodString>;
            isDeleted: z.ZodOptional<z.ZodBoolean>;
            status: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
//# sourceMappingURL=comment.validation.d.ts.map