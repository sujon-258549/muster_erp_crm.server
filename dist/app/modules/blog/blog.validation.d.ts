import { z } from "zod";
export declare const BlogValidation: {
    create: z.ZodObject<{
        body: z.ZodObject<{
            title: z.ZodString;
            content: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            excerpt: z.ZodOptional<z.ZodString>;
            coverImage: z.ZodOptional<z.ZodString>;
            tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
            category: z.ZodOptional<z.ZodString>;
            isPublished: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    update: z.ZodObject<{
        body: z.ZodObject<{
            title: z.ZodOptional<z.ZodString>;
            content: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            excerpt: z.ZodOptional<z.ZodString>;
            coverImage: z.ZodOptional<z.ZodString>;
            tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
            category: z.ZodOptional<z.ZodString>;
            isPublished: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
//# sourceMappingURL=blog.validation.d.ts.map