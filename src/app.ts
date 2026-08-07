import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { config } from "./config/config.js";
import morgan from "morgan";

const app = express();

app.use(helmet());
app.use(compression());

app.use(cookieParser());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(morgan("tiny"));

app.use(
  cors({
    origin(requestOrigin: string | undefined, callback) {
      if (!requestOrigin || config.frontend_url.indexOf(requestOrigin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${requestOrigin} not allowed by CORS`));
      }
    },
    credentials: true,
  }),
);
app.use(`${config.node_env === "development" ? "/api/v1" : ""}`, routes);

app.use(errorMiddleware);

export default app;
