import { RequestHandler } from "express";
import RequestError from "../../utils/errors/requestError";

const handler: RequestHandler = () => {
  throw new RequestError("Requested path is unavailable or inexistent", 400);
}

export default handler;