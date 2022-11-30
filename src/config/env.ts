import { config } from "dotenv";

config();

export default {
  DB_URI: process.env.DB_URI as string,
  PORT: Number(process.env.PORT) as number,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY as string,
  PREFIX: process.env.PREFIX as string,
};
