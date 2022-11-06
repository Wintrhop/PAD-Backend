import { model, Schema, Document, models } from "mongoose";
import { IUser } from "../Users/Users.model";

export interface IAdPet extends Document {
  user: IUser["_id"];
  certificate: string;
  approvedBy: IUser["_id"];
}

const adPetSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    certificate:{
        type: String,
        required:true,
    },
    approvedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
      }
  },
  { timestamps: true }
);
export default model<IAdPet>("AdPet", adPetSchema);