class ValidationError extends Error {
  formatZodError = (zodError) => {
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

  constructor(zodError) {
    if (!zodError) {
      throw new SyntaxError(
        "A zod error must be provided to create a ValidationError"
      );
    }
    super();
    this.info = this.formatZodError(zodError);
    this.name = "ValidationError";
  }
}

module.exports = ValidationError;