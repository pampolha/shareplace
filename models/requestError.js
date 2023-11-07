class RequestError extends Error {
  constructor(message, code) {
    if (!(message && code)) {
      throw new SyntaxError(
        "All arguments must be provided to create a RequestError"
      );
    }
    super(message);
    this.code = code;
    this.name = "RequestError";
  }
}

module.exports = RequestError;
