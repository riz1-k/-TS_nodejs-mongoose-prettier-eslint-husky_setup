import { dbConnect } from "./mongoose";
import expressLoader from "./express";
import { Application } from "express";

const loader = async (app: Application) => {
  await dbConnect();
  expressLoader(app);
};

export default loader;
