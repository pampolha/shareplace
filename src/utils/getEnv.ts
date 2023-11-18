import { configDotenv } from "dotenv";

export default () => {
  const env = configDotenv();
  if (env.error || !env.parsed)
    throw new Error("Error occured while loading environment variables");
  return env.parsed;
};
