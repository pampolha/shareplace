const bodyParser = require("body-parser");
const express = require("express");
const placesRouter = require("./routes/places");
const usersRouter = require("./routes/users");
const RequestError = require("./utils/errors/requestError");
const ValidationError = require("./utils/errors/validationError");
const dynamoose = require('dynamoose');
const { configDotenv } = require("dotenv");

const env = configDotenv().parsed;
const app = express();

app.use(bodyParser.json()).use((error, req, res, next) => {
  if (error)
    res.status(400).json({
      message: "Request body is not valid JSON.",
    });
});
app.use("/api/places", placesRouter);
app.use("/api/users", usersRouter);
app.use((req, res) => {
  throw new RequestError("Requested path is unavailable or inexistent", 400);
});
app.use((error, req, res, next) => {
  if (res.headerSent) return next();
  switch (error.constructor) {
    case ValidationError:
      return res.status(400).json({
        message: "Validation error",
        info: error.info,
      });
    case RequestError:
      return res.status(error.code).json({
        message: error.message,
      });
    default:
      console.error(error);
      return res.status(500).json({
        message: "An server error occurred.",
      });
  }
});

const db = new dynamoose.aws.ddb.DynamoDB({
  credentials: {
      "accessKeyId": env.aws_access_key,
      "secretAccessKey": env.aws_secret_access_key,
  },
  region: env.aws_region
});
dynamoose.aws.ddb.set(db);
app.listen(5000);
