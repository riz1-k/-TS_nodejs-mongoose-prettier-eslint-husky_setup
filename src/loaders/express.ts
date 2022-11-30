import express, { Application, Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import morgan from "morgan";
import helmet from "helmet";
import bodyParser from "body-parser";
import compression from "compression";
import { Env } from "../config";

import router from "../api/routes";
import { logger } from "../utils";
import rateLimiter from "../api/middlewares/rate-limiter";
import { TypeErrorCodes, TypeErrorLevel } from "../../types/logs";

const whiteListedDomains: string[] = ["http://localhost:3000"];

export default (app: Application) => {
  process.on("uncaughtException", async (error) => {
    logger("00001", "", error.message, "Uncaught Exception");
  });

  process.on("unhandledRejection", async (ex: any) => {
    logger("00002", "", ex.message, "Unhandled Rejection");
  });

  if (!Env.JWT_SECRET_KEY) {
    logger("00003", "", "Jwtprivatekey is not defined", "Process-Env");
    process.exit(1);
  }

  const corsOptions: CorsOptions = {
    origin(origin, callback) {
      if (!origin || whiteListedDomains.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  };

  app.enable("trust proxy");
  app.use(bodyParser.json());
  app.use(morgan("dev"));
  app.use(helmet());
  app.use(compression());
  app.use(express.static("public"));
  app.disable("x-powered-by");

  app.use(cors(corsOptions));

  app.use(rateLimiter);
  app.use(Env.PREFIX, router);

  app.get("/", (_req, res) =>
    res
      .status(200)
      .json({
        resultMessage: "Project is successfully working...",
        resultCode: "00004",
      })
      .end()
  );

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Content-Security-Policy-Report-Only", "default-src: https:");
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT POST PATCH DELETE GET");
      return res.status(200).json({});
    }
    next();
  });

  app.use((_req, _res, next) => {
    const error = new Error("Endpoint could not find!") as any;
    error.status = 404;
    next(error);
  });

  app.use((error: any, req: Request, res: Response) => {
    res.status(error.status || 500);
    let resultCode: TypeErrorCodes = "00015";
    let level: TypeErrorLevel = "External Error";
    if (error.status === 500) {
      resultCode = "00008";
      level = "Server Error";
    } else if (error.status === 404) {
      resultCode = "00014";
      level = "Client Error";
    }
    // @ts-ignore
    logger(resultCode, req?.user?._id ?? "", error.message, level, req);
    return res.json({
      resultMessage: error.message,
      resultCode,
    });
  });
};
