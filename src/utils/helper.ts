import { Request, Response, NextFunction } from 'express';

type AsyncFunc = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export const asyncHandler = (fn: AsyncFunc) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const responseHandler = (
  res: any,
  statusCode: number,
  message: string,
  data: any = null
) => {
  res.status(statusCode).json({
    success: statusCode < 400,
    code: statusCode,
    message,
    data,
  });
};

