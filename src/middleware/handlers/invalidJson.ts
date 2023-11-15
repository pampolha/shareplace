import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

const handler: ErrorRequestHandler = (
  error: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error)
    res.status(400).json({
      message: "Request body is not valid JSON.",
    });
  else next();
};

export default handler;