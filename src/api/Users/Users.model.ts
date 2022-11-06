import { model, Schema, Document, models } from "mongoose";
import { IAdPet } from "../advicerPetition/adPet.model";
import { IAdvice } from "../advices/advices.model";
const emailRegex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
import { IStudy } from "../studies/studies.model";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  profileImg: string;
  studies: IStudy["_id"];
  advices: IAdvice["_id"];
  approved: boolean;
  advicerPetition: IAdPet["_id"];
  advicersApproved: IAdPet["_id"];
}

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      match: [emailRegex, "You must enter a valid email example@example.com"],
      required: [true, "Please Enter an Email"],
    },

    password: {
      type: String,
      required: [true, "you should enter a password."],
    },
    role: {
      type: String,
      required: true,
      enum: {
        values: ["admin", "advicer", "client"],
        message: "Invalid rol",
      },
    },
    profileImg: {
      type: String,
      required: false,
    },
    studies: {
      type: [{ type: Schema.Types.ObjectId, ref: "Study" }],
      required: false,
    },
    advices: {
      type: [{ type: Schema.Types.ObjectId, ref: "Advice" }],
      required: false,
    },
    approved: {
      type: Boolean,
      required: false,
    },
    advicerPetition: {
      type: Schema.Types.ObjectId,
      ref: "AdPet",
      required: false,
    },
    advicersApproved:{
      type:[{type: Schema.Types.ObjectId,ref:"AdPet"}],
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

export default model<IUser>("User", userSchema);
