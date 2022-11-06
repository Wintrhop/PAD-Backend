import { Router } from "express";
import { create, listUserAdvices, listAllUsers, show } from "./advices.controller";
import {auth} from "../../utils/auth"
import { formData } from "../../utils/formData";

const router = Router()

router.route("/:studyId").post(auth,formData,create);
router.route("/").get(auth,listUserAdvices);
router.route("/adm").get(auth,listAllUsers);
router.route("/:adviceId").get(auth,show);
export default router