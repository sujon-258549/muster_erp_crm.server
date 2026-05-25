import type { Response } from "express";

const sendResponse = <T>(
  res: Response,
  jsonData: {
    success: boolean;
    statusCode: number;
    message: string;
    data?: T | null | undefined;
    meta?: { page: number; limit: number; total: number } | undefined;
  }
) => {
  res.status(jsonData.statusCode).json({
    success: jsonData.success,
    message: jsonData.message,
    data: jsonData.data ?? undefined,
    meta: jsonData.meta ? jsonData.meta : undefined,
  });
};

export default sendResponse;