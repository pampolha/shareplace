const ValidationError = require("../utils/errors/validationError");

const requestValidator = (zodSchema) => async (req, res, next) => {
  try {
    await zodSchema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    next(new ValidationError(error));
  }
};

module.exports = requestValidator;
