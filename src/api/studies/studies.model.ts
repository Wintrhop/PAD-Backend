import { model, Schema, Document, models } from "mongoose";
import { IAdvice } from "../advices/advices.model";
import { IUser } from "../Users/Users.model";

export interface IStudy extends Document {
  user: IUser["_id"];
  advice: IAdvice["_id"]
  tradLib: string;
  mayorExtension?: string;
  escritura: string;
  regPropHorizontal: string;
}
const studySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    advice: {
      type: Schema.Types.ObjectId,
      ref: "Advice",
      required: false,
    },
    tradLib: {
      type: String,
      required: true,
    },
    mayorExtension: {
      type: String,
      required: false,
    },
    escritura: {
      type: String,
      required: true,
    },
    regPropHorizontal: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model<IStudy>("Study", studySchema);