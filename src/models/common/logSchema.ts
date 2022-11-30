import { Types, Document, Schema, model } from "mongoose";

export interface ILog extends Document {
  userId?: Types.ObjectId;
  resultCode: string;
  level: string;
  errorMessage: string;
  ip: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const logSchema = new Schema<ILog>(
  {
    userId: { type: Schema.Types.ObjectId },
    resultCode: { type: String, required: true },
    level: { type: String, required: true },
    errorMessage: { type: String, required: true },
    ip: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Log = model("Log", logSchema);
export default Log;
