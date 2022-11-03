import { model, Schema, Document, models } from "mongoose";
const emailRegex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
import { IStudy } from "../studies/studies.model";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role : string;
  studies: IStudy["_id"];
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
    rol: {
        type: String,
        required: true,
        enum: {
          values: ['admin', 'advicer', 'client'],
          message: 'Invalid rol',
        },
      },
    studies:{
      type:[{type:Schema.Types.ObjectId, ref:'Study'}],
      required: false,

    }
  },
  {
    timestamps: true,
  }
);

export default model<IUser>("User", userSchema);
