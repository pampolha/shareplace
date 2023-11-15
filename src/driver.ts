import bodyParser from "body-parser";
import express from "express";
import placesRouter from "./routes/places";
import usersRouter from "./routes/users";
import dynamoose from 'dynamoose';
import { configDotenv } from "dotenv";
import invalidJsonHandler from "./middleware/handlers/invalidJson";
import unavailablePathHandler from './middleware/handlers/unavailabePath';
import errorHandler from './middleware/handlers/error';

const PORT = 5000;
const env = configDotenv().parsed;
if (!env) throw new Error('Environment variables were not loaded');
const server = express();

server.use(bodyParser.json()).use(invalidJsonHandler);
server.use("/api/places", placesRouter);
server.use("/api/users", usersRouter);
server.use(unavailablePathHandler);
server.use(errorHandler);

const db = new dynamoose.aws.ddb.DynamoDB({
  credentials: {
      "accessKeyId": env.aws_access_key,
      "secretAccessKey": env.aws_secret_access_key,
  },
  region: env.aws_region
});
dynamoose.aws.ddb.set(db);
server.listen(PORT);
console.log(`Server running on port ${PORT}`);
