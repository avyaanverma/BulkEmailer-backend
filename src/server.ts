import app from "./app.js";
import { config } from "./config/config.js";
import { connectDatabase } from "./config/database.js";
import { logger } from "./config/logger.js";

async function bootstrap() {
  await connectDatabase();

  app.listen(config, () => {
    logger.info(`Server running on ${config.port}`);
  });
}

bootstrap();
