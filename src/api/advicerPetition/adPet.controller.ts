import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../Users/Users.model";
import AdPet, { IAdPet } from "./adPet.model";
import { RequestWithUserId } from "../../utils/auth";

export async function listAllAdPets(
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
    const adPets = await AdPet.find().populate({
      path: "user",
      select: "-_id -password -studies -advices ",
    });

    if (adPets.length === 0) {
      throw new Error("Petitions for Advicer is empty");
    }
    res.status(201).json({ message: "Petitions found", data: adPets });
  } catch (err: any) {
    res.status(404).json({ message: "Error", error: err.message });
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
    if (user.approved != undefined){
      throw new Error("Petition already Created");
  }
    const newAdvicer = {
      ...data,
      user: userAuthId,
    };
    const avicerPet = await AdPet.create(newAdvicer);
    user.advicerPetition = avicerPet._id;
    user.approved = false;
    await user.save({ validateBeforeSave: false });

    res.status(201).json({ message: "Advicer Petition Created", data: data });
  } catch (err: any) {
    res.status(400).json({
      message: "Advicer Petition could not be created",
      error: err.message,
    });
  }
}
export async function adminApproval(
  req: RequestWithUserId,
  res: Response,
  next: NextFunction
):Promise<void> {
    try {
        const userAuthId = req.userId;
        const {petitionId} = req.params;
        const userAdmin = await User.findById(userAuthId);
        if(!userAdmin){
            throw new Error("Invalid User");
        }
        if (userAdmin?.role !== "admin") {
            throw new Error("Admin required");
          }
          const advicerPetition = await AdPet.findById(petitionId);
        if(!advicerPetition){
            throw new Error("Invalid Petition");
        }
        let {user } = advicerPetition;
        if (user.approved === true){
            throw new Error("Petition already approved");
        }
        const advicerUser = await User.findById(user._id);
        if(!advicerUser){
          throw new Error("Invalid User");
          
        }
        advicerUser.approved = true;
        advicerUser.role = "advicer";
        advicerPetition.approvedBy = userAdmin._id;
        userAdmin.advicersApproved.push(advicerPetition._id)
        await advicerUser.save({ validateBeforeSave: false });
        await advicerPetition.save({validateBeforeSave:false});
        await userAdmin.save({validateBeforeSave:false});

        res.status(201).json({ message: "Advicer Petition approved", data: advicerPetition });
    } catch (err:any) {
        res.status(400).json({
            message: "Advicer Petition could not be approved",
            error: err.message,
          });
    }
}
export async function consultPetUser(
  req: RequestWithUserId,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userAuthId = req.userId;
    const user = await User.findById(userAuthId)
      .select("-_id role approved advicerPetition")
      
    res.status(201).json({ message: "consult Pet done", data: user });
  } catch (err: any) {
    res.status(404).json({ message: "Error", error: err.message });
  }
}

