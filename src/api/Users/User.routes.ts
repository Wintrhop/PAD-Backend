import { Router } from "express";
import { signUp, signIn, update, destroy, list } from "./Users.controller";
import {auth} from "../../utils/auth"

const router = Router()

router.route("/signUp").post(signUp);
router.route("/logIn").post(signIn);
router.route("/").get(list);
router.route("/").put(auth,update);
router.route("/").delete(auth, destroy);

export default router