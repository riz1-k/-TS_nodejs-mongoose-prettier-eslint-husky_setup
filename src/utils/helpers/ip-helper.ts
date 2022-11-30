import { Request } from "express";

export default (req: Request) =>
  req.headers["x-forwarded-for"]
    ? (req.headers["x-forwarded-for"] as string)?.split(/, /)[0]
    : req.connection.remoteAddress;
