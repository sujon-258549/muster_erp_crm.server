import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
declare const validateRequest: (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default validateRequest;
//# sourceMappingURL=validateRequest.d.ts.map