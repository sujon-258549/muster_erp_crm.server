import { z } from "zod";
export declare const DepartmentValidation: {
    createDepartmentZodSchema: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    updateDepartmentZodSchema: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
//# sourceMappingURL=department.validation.d.ts.map