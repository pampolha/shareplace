import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import RequestError from "../../utils/errors/requestError";
import ValidationError from "../../utils/errors/validationError";
import { HttpStatusCode } from "axios";

const { NotFound, InternalServerError } = HttpStatusCode;

const handler: ErrorRequestHandler = (
  error: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) return next();
  if (error instanceof ValidationError) {
    return res.status(NotFound).json({
      message: "Validation error",
      info: error.info,
    });
  } else if (error instanceof RequestError) {
    return res.status(error.code).json({
      message: error.message,
    });
  } else {
    console.error(error);
    return res.status(InternalServerError).json({
      message: "An server error occurred.",
    });
  }
};

export default handler;
