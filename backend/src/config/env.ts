import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  MONGO_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  COOKIE_MAX_AGE_MS: number;
  CLIENT_ORIGIN: string;
}

const getEnvVar = (key: string, fallback?: string): string => {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
  return value;
};

const env: EnvConfig = {
  NODE_ENV: getEnvVar("NODE_ENV", "development"),
  PORT: parseInt(getEnvVar("PORT", "5000"), 10),
  MONGO_URI: getEnvVar("MONGO_URI"),
  JWT_SECRET: getEnvVar("JWT_SECRET"),
  JWT_EXPIRES_IN: getEnvVar("JWT_EXPIRES_IN", "1d"),
  // Default cookie lifetime: 24 hours
  COOKIE_MAX_AGE_MS: parseInt(
    getEnvVar("COOKIE_MAX_AGE_MS", String(24 * 60 * 60 * 1000)),
    10
  ),
  CLIENT_ORIGIN: getEnvVar("CLIENT_ORIGIN", "http://localhost:5173"),
};

export default env;
