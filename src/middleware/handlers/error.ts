import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import RequestError from "../../utils/errors/requestError";
import ValidationError from "../../utils/errors/validationError";

const handler: ErrorRequestHandler = (
  error: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) return next();
  if (error instanceof ValidationError) {
    return res.status(400).json({
      message: "Validation error",
      info: error.info,
    });
  } else if (error instanceof RequestError) {
    return res.status(error.code).json({
      message: error.message,
    });
  } else {
    console.error(error);
    return res.status(500).json({
      message: "An server error occurred.",
    });
  }
};

export default handler;
