import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "axios";

const { NotFound } = HttpStatusCode;

const handler: ErrorRequestHandler = (
  error: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error)
    res.status(NotFound).json({
      message: "Request body is not valid JSON.",
    });
  else next();
};

export default handler;
