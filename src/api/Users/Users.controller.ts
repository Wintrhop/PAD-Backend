import { Request, Response, NextFunction } from "express";
import User, { IUser } from "./Users.model";
import {RequestWithUserId} from "../../utils/auth"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const passwordRegex = new RegExp(
  "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
);


export async function signUp(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, name, password } = req.body;
    if (!passwordRegex.test(password)) {
      throw new Error(
        `Password must have at least 8 characters, At least one upper case,
       At least one lower case, At least one digit, At least one special character`
      );
    }
    const userExist= await User.findOne({ email });
    if(userExist) {
      throw new Error("Email already exist");      
    }
    const encPassword: string = await bcrypt.hash(password, 8);
    const user: IUser = await User.create({
      name,
      email,
      password: encPassword,
      rol: "client",
    });
    const token: string = jwt.sign(
      { id: user._id },
      process.env.SECRET_KEY as string,
      {
        expiresIn: 60 * 60 * 24,
      }
    );
    res.status(201).json({
      message: "user created successfully",
      data: { name, email, token },
    });
  } catch (err: any) {
    res.status(400).json({ message: "user could not be created", error: err.message });
  }
}

export async function signIn(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body;
    const user: IUser | null = await User.findOne({ email });

    if (!user) {
      throw new Error("Email or password invalid");
    }
    const isValid: boolean = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error("Email or password invalid");
    }
    const token: string = jwt.sign(
      { id: user._id },
      process.env.SECRET_KEY as string,
      {
        expiresIn: 60 * 60 * 24,
      }
    );
    res
      .status(201)
      .json({ message: "User Login Successfully", data: { email, token } });
  } catch (err: any) {
    res.status(400).json({ message: "User could not login", error: err.message });
  }
}

export async function list(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await User.find().select("-_id -password");
    res.status(201).json({ message: "Users found", data: user });
  } catch (err: any) {
    res.status(404).json(err.message);
  }
}
export async function update(
  req: RequestWithUserId,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data: object = req.body;
    const userAuthId = User.findById(req.userId).select("-_id -password");
    if (!userAuthId) {
      throw new Error("User not found");
    }

    const user = await User.findByIdAndUpdate(req.userId, data, { new: true });
    res.status(200).json({ message: "User Updated", data: data });
  } catch (err: any) {
    res
      .status(400)
      .json({ message: "User could not be Updated", error: err.message });
  }
}
export async function destroy(
    req: RequestWithUserId,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data: object = req.body;
      const userAuthId = User.findById(req.userId);
      if (!userAuthId) {
        throw new Error("User not found");
      }
  
      const user = await User.findByIdAndDelete(req.userId);
      res.status(200).json({ message: "User Deleted", data: user });
    } catch (err: any) {
      res
        .status(400)
        .json({ message: "User could not be Updated", error: err.message });
    }
  }
