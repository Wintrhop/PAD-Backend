import { Router } from "express";
import { create, show, update, destroy, list } from "./studies.controller";
import {auth} from "../../utils/auth"

const router = Router()

router.route("/").post(auth,create);
router.route("/").get(auth,list);
router.route("/:studyId").get(auth,show);
router.route("/:studyId").put(auth,update);
router.route("/:studyId").delete(auth, destroy);

export default router