import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import catchAsync from "../shared/catchAsync.ts";

const validateRequest = (schema: ZodSchema) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
      cookies: req.cookies,
    });
    next();
  });
};

export default validateRequest;
