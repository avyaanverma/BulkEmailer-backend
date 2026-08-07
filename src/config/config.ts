import { z } from "zod";
import { config as dotenvConfig } from "dotenv";
dotenvConfig();

const envSchema = z.object({
  port: z.coerce.number().default(5000),
  node_env: z.enum(["development", "production"]).default("development"),
  mongo_uri: z.string(),
  access_token_secret: z.string().min(32),
  refresh_token_secret: z.string().min(32),
  frontend_url: z
    .string()
    .transform((value) => value.split(",").map((url) => url.trim()))
    .pipe(z.array(z.string().url())),
  google_client_id: z.string(),
  google_client_secret: z.string(),
  google_redirect_url: z.string().url(),
  access_token_expires: z.string(),
  refresh_token_expires: z.string(),
  logger_level: z.enum(["debug", "info", "warn", "error"]).default("debug"),
});

const envObject = {
  port: process.env.PORT,
  node_env: process.env.NODE_ENV,
  mongo_uri: process.env.MONGO_URI,
  access_token_secret: process.env.JWT_ACCESS_SECRET,
  refresh_token_secret: process.env.JWT_REFRESH_SECRET,
  frontend_url: process.env.FRONTEND_URL,
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
  google_redirect_url: process.env.GOOGLE_REDIRECT_URI,
  access_token_expires: process.env.ACCESS_TOKEN_EXPIRES,
  refresh_token_expires: process.env.REFRESH_TOKEN_EXPIRES,
  logger_level: process.env.LOGGER_LEVEL,
};

const result = envSchema.safeParse(envObject);

if (!result.success) {
  console.error("Failed to parse safeParse");
  console.error(result.error.message);
  process.exit(1);
}

export const config = result.data;
