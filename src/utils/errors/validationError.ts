import { ZodError } from "zod";

class ValidationError extends Error {
  formatZodError = (zodError: ZodError) => {
    const parsedErrors = [];
    const { issues } = zodError;

    for (const issue of issues) {
      const additionalInfos = Object.entries(issue)
        .filter((entry) => {
          const fieldNameIndex = 0;
          return !entry[fieldNameIndex].match(/^(message|code|path)$/);
        })
        .map((entry) => entry.join(": "));

      parsedErrors.push({
        message: issue.message,
        code: issue.code,
        path: issue.path.join(" > "),
        additionalInfos,
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
