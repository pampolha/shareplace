import { RequestHandler } from "express";
import RequestError from "../../utils/errors/requestError";
import { HttpStatusCode } from "axios";

const { NotFound } = HttpStatusCode;

const handler: RequestHandler = () => {
  throw new RequestError(
    "Requested path is unavailable or inexistent",
    NotFound
  );
};

export default handler;
