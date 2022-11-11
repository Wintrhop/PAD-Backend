import { Router } from "express";
import { create, listAllAdPets, adminApproval, consultPetUser } from "./adPet.controller";
import {auth} from "../../utils/auth"
import { formData } from "../../utils/formData";

const router = Router()

router.route("/").post(auth,formData,create);
router.route("/adm/:petitionId").post(auth,adminApproval);
router.route("/adm").get(auth,listAllAdPets);
router.route("/userPet").get(auth,consultPetUser);
export default router