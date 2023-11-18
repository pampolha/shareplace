import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

import ValidationError from "../utils/errors/validationError";

const requestValidator =
  (zodSchema: ZodSchema) =>
  async (req: Request, _res: Response, next: NextFunction) =>
    await zodSchema
      .parseAsync({
        body: <Object>req.body,
        query: req.query,
        params: req.params,
      })
      .catch((error) => next(new ValidationError(error)));

export default requestValidator;
