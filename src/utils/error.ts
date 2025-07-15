import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

interface CustomError extends Error {
  statusCode?: number;
  errors?: any;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  console.error('Error:', err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      issues: err.issues,
    });
  }

  const statusCode = typeof err.statusCode === 'number' ? err.statusCode : 500;

  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};
