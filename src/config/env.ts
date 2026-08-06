import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  MONGO_URI: z.string(),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  FRONTEND_URL: z.string().url(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_REDIRECT_URI: z.string().url(),
  ACCESS_TOKEN_EXPIRES:z.string(),
  REFRESH_TOKEN_EXPIRES:z.string(),
  LOGGER_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("debug"),
});

export const env = envSchema.parse(process.env);
