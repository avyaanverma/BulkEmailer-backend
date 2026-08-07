import pino from "pino";
import { config } from "./config.js";

const transport =
  config.node_env === "development"
    ? pino.transport({
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid, hostname",
        },
      })
    : undefined;

export const logger = pino(
  { level: config.node_env === "development" ? "debug" : "info" },
  transport,
);
