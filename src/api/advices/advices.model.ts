import { model, Schema, Document, models } from "mongoose";
import { IUser } from "../Users/Users.model";
import { IStudy } from "../studies/studies.model";

export interface IAdvice extends Document {
  user: IUser["_id"];
  study: IStudy["_id"];
  advice: string;
}
const adviceSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    study: {
      type: Schema.Types.ObjectId,
      ref: "Study",
      required: true,
    },
    advice: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model<IAdvice>("Advice", adviceSchema);
