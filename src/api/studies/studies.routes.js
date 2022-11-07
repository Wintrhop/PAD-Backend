"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const studies_controller_1 = require("./studies.controller");
const auth_1 = require("../../utils/auth");
const formData_1 = require("../../utils/formData");
const router = (0, express_1.Router)();
router.route("/").post(auth_1.auth, formData_1.formData, studies_controller_1.create);
router.route("/").get(auth_1.auth, studies_controller_1.list);
router.route("/advicer").get(auth_1.auth, studies_controller_1.listAdvicersAssignments);
router.route("/:studyId").get(auth_1.auth, studies_controller_1.show);
router.route("/:studyId").put(auth_1.auth, studies_controller_1.update);
router.route("/:studyId").delete(auth_1.auth, studies_controller_1.destroy);
exports.default = router;