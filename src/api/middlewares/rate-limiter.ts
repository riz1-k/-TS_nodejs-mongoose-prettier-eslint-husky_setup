import { RateLimiterMongo } from "rate-limiter-flexible";
import mongoose from "mongoose";
import type { Request, Response, NextFunction } from "express";
import { resHandler } from "../../utils/index";
import { Env } from "../../config";

const mongoConn = mongoose.createConnection(Env.DB_URI);

const opts = {
  storeClient: mongoConn,
  tableName: "rateLimits",
  points: 100, // x requests
  duration: 60, // per y second by IP
};

export default (req: Request, res: Response, next: NextFunction) => {
  const rateLimiterMongo = new RateLimiterMongo(opts);
  rateLimiterMongo
    .consume(req.ip)
    .then(() => {
      next();
    })
    .catch((err) =>
      res.status(429).json(resHandler(req, null, err.message, "00024"))
    );
};
