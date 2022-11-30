import logger from "../logger";
import en from "../lang/error-codes";
import { Request } from "express";
import { TypeErrorCodes } from "../../../types/logs";

export default (
  req: Request,
  data?: any,
  message?: string,
  code?: TypeErrorCodes,
  fields?: any
) => {
  let resMessage = message;
  if (code !== undefined) {
    let key = code;
    if (!en[code]) key = "00008";
    let userId = "";
    // @ts-ignore
    if (req && req.user && req.user._id) userId = req.user._id;

    const enMessage = en[key];
    if (enMessage.includes("server error")) {
      logger(code, userId, message, "Server Error", req);
    } else {
      logger(code, userId, message ?? enMessage, "Client Error", req);
    }
    resMessage = code === "00008" ? message || enMessage : enMessage;
  }

  return {
    data,
    error: {
      code,
      message: resMessage,
      fields,
    },
  };
};
