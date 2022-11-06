import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../Users/Users.model";
import Study, { IStudy } from "../studies/studies.model";
import Advice, { IAdvice } from "./advices.model";
import { RequestWithUserId } from "../../utils/auth";

export async function listUserAdvices(
  req: RequestWithUserId,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userAuthId = req.userId;
    const user = await User.findById(userAuthId);
    if (!user) {
      throw new Error("Invalid User");
    }
    if (user.role === "client") {
      throw new Error("Invalid Role");
    }
    const userList = await User.findById(userAuthId)
      .select("-_id -password -studies -advicersApproved -advicerPetition")
      .populate({
        path: "advices",
        select: "-user",
      });

    if (userList?.advices.length === 0) {
      throw new Error("Advices is empty");
    }
    res.status(201).json({ message: "Advices found", data: userList });
  } catch (err: any) {
    res.status(404).json({ message: "Error", error: err.message });
  }
}
export async function listAllUsers(
  req: RequestWithUserId,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userAuthId = req.userId;
    const user = await User.findById(userAuthId);

    if (!user) {
      throw new Error("invalid User");
    }

    if (user?.role !== "admin") {
      throw new Error("Admin required");
    }
    const advices = await Advice.find()
      .populate({
        path: "user",
        select: "-_id name email",
      })
      .populate({
        path: "study",
        select: "-user -advice",
      });
    if (advices.length === 0) {
      throw new Error("Users advices is empty");
    }
    res.status(201).json({ message: "Advices found", data: advices });
  } catch (err: any) {
    res.status(404).json({ message: "Error", error: err.message });
  }
}

export async function show(
  req: RequestWithUserId,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userAuthId = req.userId;
    const { adviceId } = req.params;
    const advice = await Advice.findById(adviceId);
    const user = await User.findById(userAuthId);
    if (!advice?.user) {
      throw new Error("Advice not found");
    }
    if (!user) {
      throw new Error("Invalid User");
    }
    if (user.role === "client") {
      throw new Error("Invalid Role");
    }
    if (user.role !== "admin") {
      if (advice?.user.toString() !== userAuthId) {
        throw new Error("Invalid User");
      }
    }
    const adviceShow = await Advice.findById(adviceId)
      .populate({
        path: "user",
        select: "-_id name email role profileImg",
      })
      .populate({
        path: "study",
        select: "-user -advice",
      });

    res.status(201).json({ message: "Advice found", data: adviceShow });
  } catch (err: any) {
    res.status(400).json({ message: "error", error: err.message });
  }
}
export async function create(
  req: RequestWithUserId,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userAuthId = req.userId;
    const { studyId } = req.params;
    const data = req.body;
    const user = await User.findById(userAuthId);
    const study = await Study.findById(studyId);

    if (!user) {
      throw new Error("Invalid User");
    }
    if (!study) {
      throw new Error("Invalid Study");
    }
    if (user.role === "client") {
      throw new Error("Invalid Role");
    }
    if(study.advice!== undefined){
      throw new Error("Advice Already Created");
    }
    const newAdvice = {
      ...data,
      user: userAuthId,
      study: studyId,
    };
    const adviceCreate = await Advice.create(newAdvice);
    user.advices.push(adviceCreate._id);
    study.advice = adviceCreate._id;
    await user.save({ validateBeforeSave: false });
    await study.save({ validateBeforeSave: false });
    res.status(201).json({ message: "Advice Created", data: data });
  } catch (err: any) {
    res.status(400).json({
      message: "Advice could not be created",
      error: err.message,
    });
  }
}
