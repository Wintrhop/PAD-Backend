import { Router } from "express";
import {
  create,
  show,
  update,
  destroy,
  list,
  listAdvicersAssignments,
} from "./studies.controller";
import { auth } from "../../utils/auth";
import { formData } from "../../utils/formData";

const router = Router();

router.route("/").post(auth, formData, create);
router.route("/").get(auth, list);
router.route("/advicer").get(auth, listAdvicersAssignments);
router.route("/:studyId").get(auth, show);
router.route("/:studyId").put(auth, update);
router.route("/:studyId").delete(auth, destroy);

export default router;
