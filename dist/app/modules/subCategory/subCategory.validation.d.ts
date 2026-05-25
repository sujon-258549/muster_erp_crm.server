import { z } from "zod";
export declare const SubCategoryValidation: {
    createSubCategoryZodSchema: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodString;
            categoryId: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            icon: z.ZodOptional<z.ZodString>;
            slug: z.ZodOptional<z.ZodString>;
            status: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    updateSubCategoryZodSchema: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            categoryId: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            icon: z.ZodOptional<z.ZodString>;
            slug: z.ZodOptional<z.ZodString>;
            status: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
//# sourceMappingURL=subCategory.validation.d.ts.map