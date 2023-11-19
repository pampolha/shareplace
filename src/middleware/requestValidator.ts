import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

import ValidationError from "../utils/errors/validationError";

const requestValidator =
  (zodSchema: ZodSchema) =>
    async (req: Request, _res: Response, next: NextFunction) =>
      await zodSchema
        .parseAsync({
          body: req.body,
          query: req.query,
          params: req.params,
        })
        .then(() => next())
        .catch((error) => next(new ValidationError(error)));

export default requestValidator;
