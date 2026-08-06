import dotenv from "dotenv";

dotenv.config();

import app from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase } from "./config/database.js";
import { logger } from "./config/logger.js";

async function bootstrap() {
  await connectDatabase();

  app.listen(env.PORT, () => {
    logger.info(`Server running on ${env.PORT}`);
  });
}

bootstrap();