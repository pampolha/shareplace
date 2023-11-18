import bodyParser from "body-parser";
import express from "express";
import placesRouter from "./routes/places";
import usersRouter from "./routes/users";
import dynamoose from "dynamoose";
import { configDotenv } from "dotenv";
import invalidJsonHandler from "./middleware/handlers/invalidJson";
import unavailablePathHandler from "./middleware/handlers/unavailabePath";
import errorHandler from "./middleware/handlers/error";

const PORT = 5000;
const envOut = configDotenv();
if (envOut.error || !envOut.parsed)
  throw new Error("Failed to load environment variables");
const env = envOut.parsed;
const server = express();

server.use(bodyParser.json()).use(invalidJsonHandler);
server.use("/api/places", placesRouter);
server.use("/api/users", usersRouter);
server.use(unavailablePathHandler);
server.use(errorHandler);

const db = new dynamoose.aws.ddb.DynamoDB({
  credentials: {
    accessKeyId: env.aws_access_key,
    secretAccessKey: env.aws_secret_access_key,
  },
  region: env.aws_region,
});
dynamoose.aws.ddb.set(db);
server.listen(PORT);
console.log(`Server running on port ${PORT}`);

export { env };
