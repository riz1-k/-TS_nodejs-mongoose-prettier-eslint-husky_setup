import mongoose from "mongoose";
import { Env } from "../config";

const dbConnect = async () => {
  try {
    await mongoose.connect(Env.DB_URI);
    console.clear();
    console.log("\x1b[31m%s\x1b[0m", "🗄️------- Database Connected -------🗄️");
  } catch (err: any) {
    console.log(err.message);
  }
};

const conn = mongoose.connection;

export { dbConnect, conn };
