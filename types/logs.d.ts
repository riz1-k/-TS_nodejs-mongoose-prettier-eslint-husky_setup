import errorCodes from "../src/utils/lang/error-codes";

type TypeErrorCodes = keyof typeof errorCodes;

type TypeErrorLevel =
  | "External Error"
  | "Server Error"
  | "Client Error"
  | "Uncaught Exception"
  | "Unhandled Rejection"
  | "Process-Env";

export { TypeErrorCodes, TypeErrorLevel };
