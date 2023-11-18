import { HttpStatusCode } from "axios";

class RequestError extends Error {
  code: HttpStatusCode;
  constructor(message: string, code: HttpStatusCode) {
    super(message);
    this.code = code;
    this.name = "RequestError";
  }
}

export default RequestError;
