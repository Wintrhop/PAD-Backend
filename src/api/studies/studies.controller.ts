import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../Users/Users.model";
import Study, { IStudy } from "./studies.model";
import { RequestWithUserId } from "../../utils/auth";

export async function list(
  req: RequestWithUserId,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userAuthId = req.userId;
    const userList = await User.findById(userAuthId)
      .select("-_id -password")
      .populate({
        path: "studies",
        select: "-user",
      });
    if (userList?.studies.length === 0) {
      throw new Error("Studies is empty");
    }
    res.status(201).json({ message: "Studies found", data: userList });
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
    const { studyId } = req.params;
    const study = await Study.findById(studyId);
    if (!study?.user) {
      throw new Error("Study not found");
    }
    if (study?.user.toString() !== userAuthId) {
      throw new Error("Invalid User");
    }
    const studyShow = await Study.findById(studyId).populate({
      path: "user",
      select: "-_id -password ",
    });

    res.status(201).json({ message: "Study found", data: studyShow });
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
    const data = req.body;
    const user = await User.findById(userAuthId);

    if (!user) {
      throw new Error("Invalid User");
    }
    const newStudy = {
      ...data,
      user: userAuthId,
    };
    const studyCreate = await Study.create(newStudy);
    user.studies.push(studyCreate._id);
    await user.save({ validateBeforeSave: false });

    res.status(201).json({ message: "Study Created", data: data });
  } catch (err: any) {
    res.status(400).json({
      message: "Study could not be created",
      error: err.message,
    });
  }
}
export async function update(
  req: RequestWithUserId,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userAuthId = req.userId;
    const data = req.body;
    const { studyId } = req.params;
    const study = await Study.findById(studyId);
    if (!study?.user) {
      throw new Error("Study not found");
    }
    if (study?.user.toString() !== userAuthId) {
      throw new Error("Invalid User");
    }
    const studyUpdate = await Study.findByIdAndUpdate(studyId, data, {
      new: true,
    });
    res.status(200).json({ message: "Study Updated", data: data });
  } catch (err: any) {
    res.status(400).json({
      message: "Study could not be Updated",
      error: err.message,
    });
  }
}
export async function destroy(
  req: RequestWithUserId,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userAuthId = req.userId;
    const { studyId } = req.params;
    const study = await Study.findById(studyId);
    
    if (!study?.user) {
      throw new Error("Study not found");
    }
    if (study?.user.toString() !== userAuthId) {
      throw new Error("Invalid User");
    }
    const userStudy = await User.findById(userAuthId)
    const newUserStudies = userStudy?.studies.filter(
      (item:any)=> studyId !== item.toString()
    );
    if(userStudy!=undefined)
    {
      userStudy.studies = newUserStudies
    }
    await userStudy?.save({validateBeforeSave:false})
    const studyDelete = await Study.findByIdAndDelete(studyId);
    
    res.status(200).json({ message: "Study deleted", data: studyDelete });
  } catch (err: any) {
    res.status(400).json({
      message: "Study could not be deleted",
      error: err.message,
    });
  }
}