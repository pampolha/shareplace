import { ZodError } from "zod";

class ValidationError extends Error {
  formatZodError = (zodError: ZodError) => {
    const parsedErrors = [];
    const { issues } = zodError;

    for (const issue of issues) {
      const additionalInfo = Object.entries(issue)
        .filter((el) => !el[0].match(/^(message|code|path)$/))
        .map((array) => array.join(": "));

      parsedErrors.push({
        message: issue.message,
        code: issue.code,
        path: issue.path.join(" > "),
        additionalInfo,
      });
    }
    return parsedErrors;
  };
  info;
  constructor(zodError: ZodError) {
    super();
    this.info = this.formatZodError(zodError);
    this.name = "ValidationError";
  }
}

export default ValidationError;
