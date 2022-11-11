"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroy = exports.update = exports.create = exports.show = exports.listAdvicersAssignments = exports.list = void 0;
const Users_model_1 = __importDefault(require("../Users/Users.model"));
const studies_model_1 = __importDefault(require("./studies.model"));
function list(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userAuthId = req.userId;
            const userList = yield Users_model_1.default.findById(userAuthId)
                .select("-_id -password -advices -advicersApproved")
                .populate({
                path: "studies",
                select: "-user",
            });
            if ((userList === null || userList === void 0 ? void 0 : userList.studies.length) === 0) {
                throw new Error("Studies is empty");
            }
            res.status(201).json({ message: "Studies found", data: userList });
        }
        catch (err) {
            res.status(404).json({ message: "Error", error: err.message });
        }
    });
}
exports.list = list;
function listAdvicersAssignments(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userAuthId = req.userId;
            const userList = yield Users_model_1.default.findById(userAuthId)
                .select("-_id name email role profileImg ")
                .populate({
                path: "studiesAssignment",
                select: "-user",
            });
            if ((userList === null || userList === void 0 ? void 0 : userList.role) === "client") {
                throw new Error("Invalid Role");
            }
            if ((userList === null || userList === void 0 ? void 0 : userList.studiesAssignment.length) === 0) {
                throw new Error("Assignments is empty");
            }
            res.status(201).json({ message: "Assignments found", data: userList });
        }
        catch (err) {
            res.status(404).json({ message: "Error", error: err.message });
        }
    });
}
exports.listAdvicersAssignments = listAdvicersAssignments;
function show(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userAuthId = req.userId;
            const { studyId } = req.params;
            const study = yield studies_model_1.default.findById(studyId);
            if (!(study === null || study === void 0 ? void 0 : study.user)) {
                throw new Error("Study not found");
            }
            const user = yield Users_model_1.default.findById(userAuthId);
            if ((user === null || user === void 0 ? void 0 : user.role) === "client") {
                if ((study === null || study === void 0 ? void 0 : study.user.toString()) !== userAuthId) {
                    throw new Error("user Invalid");
                }
            }
            if ((user === null || user === void 0 ? void 0 : user.role) !== "admin") {
                if ((user === null || user === void 0 ? void 0 : user.role) === "advicer") {
                    const studyAdvicer = user === null || user === void 0 ? void 0 : user.studiesAssignment.filter((item) => studyId === item.toString());
                    console.log('estudio en advicer?', studyAdvicer);
                    if (!studyAdvicer) {
                        throw new Error("Invalid Advicer");
                    }
                }
            }
            const studyShow = yield studies_model_1.default.findById(studyId).populate({
                path: "user",
                select: "-_id -password -studies -advices -role -advicersApproved",
            });
            res.status(201).json({ message: "Study found", data: studyShow });
        }
        catch (err) {
            res.status(400).json({ message: "error", error: err.message });
        }
    });
}
exports.show = show;
function create(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userAuthId = req.userId;
            const data = req.body;
            const user = yield Users_model_1.default.findById(userAuthId);
            if (!user) {
                throw new Error("Invalid User");
            }
            const advicers = yield Users_model_1.default.find({ role: "advicer" });
            let advicerAssign = advicers[0]._id;
            let lengthAssign = advicers[0].studiesAssignment;
            for (let i = 0; i < advicers.length; i++) {
                let forlength = advicers[i].studiesAssignment;
                if (forlength.length < lengthAssign.length) {
                    lengthAssign = forlength.length;
                    advicerAssign = advicers[i]._id;
                }
            }
            const advicer = yield Users_model_1.default.findById(advicerAssign);
            const newStudy = Object.assign(Object.assign({}, data), { user: userAuthId });
            const studyCreate = yield studies_model_1.default.create(newStudy);
            advicer === null || advicer === void 0 ? void 0 : advicer.studiesAssignment.push(studyCreate._id);
            yield (advicer === null || advicer === void 0 ? void 0 : advicer.save({ validateBeforeSave: false }));
            user.studies.push(studyCreate._id);
            yield user.save({ validateBeforeSave: false });
            res.status(201).json({ message: "Study Created", data: data });
        }
        catch (err) {
            res.status(400).json({
                message: "Study could not be created",
                error: err.message,
            });
        }
    });
}
exports.create = create;
function update(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userAuthId = req.userId;
            const data = req.body;
            const { studyId } = req.params;
            const study = yield studies_model_1.default.findById(studyId);
            if (!(study === null || study === void 0 ? void 0 : study.user)) {
                throw new Error("Study not found");
            }
            if ((study === null || study === void 0 ? void 0 : study.user.toString()) !== userAuthId) {
                throw new Error("Invalid User");
            }
            const studyUpdate = yield studies_model_1.default.findByIdAndUpdate(studyId, data, {
                new: true,
            });
            res.status(200).json({ message: "Study Updated", data: data });
        }
        catch (err) {
            res.status(400).json({
                message: "Study could not be Updated",
                error: err.message,
            });
        }
    });
}
exports.update = update;
function destroy(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userAuthId = req.userId;
            const { studyId } = req.params;
            const study = yield studies_model_1.default.findById(studyId);
            if (!(study === null || study === void 0 ? void 0 : study.user)) {
                throw new Error("Study not found");
            }
            if ((study === null || study === void 0 ? void 0 : study.user.toString()) !== userAuthId) {
                throw new Error("Invalid User");
            }
            const userStudy = yield Users_model_1.default.findById(userAuthId);
            const newUserStudies = userStudy === null || userStudy === void 0 ? void 0 : userStudy.studies.filter((item) => studyId !== item.toString());
            if (userStudy != undefined) {
                userStudy.studies = newUserStudies;
            }
            yield (userStudy === null || userStudy === void 0 ? void 0 : userStudy.save({ validateBeforeSave: false }));
            const studyDelete = yield studies_model_1.default.findByIdAndDelete(studyId);
            res.status(200).json({ message: "Study deleted", data: studyDelete });
        }
        catch (err) {
            res.status(400).json({
                message: "Study could not be deleted",
                error: err.message,
            });
        }
    });
}
exports.destroy = destroy;
