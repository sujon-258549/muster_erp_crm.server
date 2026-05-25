import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let message = err.message || "Something went wrong!";

  // Handle JWT errors specifically if they reach here
  if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
    statusCode = httpStatus.UNAUTHORIZED;
    message = "Unauthorized: Token expired or invalid";
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: {
      statusCode,
      message,
      ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {}),
    },
  });
};

export default globalErrorHandler;
