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
exports.create = exports.show = exports.listAllUsers = exports.listUserAdvices = void 0;
const Users_model_1 = __importDefault(require("../Users/Users.model"));
const studies_model_1 = __importDefault(require("../studies/studies.model"));
const advices_model_1 = __importDefault(require("./advices.model"));
function listUserAdvices(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userAuthId = req.userId;
            const user = yield Users_model_1.default.findById(userAuthId);
            if (!user) {
                throw new Error("Invalid User");
            }
            if (user.role === "client") {
                throw new Error("Invalid Role");
            }
            const userList = yield Users_model_1.default.findById(userAuthId)
                .select("-_id -password -studies -advicersApproved -advicerPetition")
                .populate({
                path: "advices",
                select: "-user",
            });
            if ((userList === null || userList === void 0 ? void 0 : userList.advices.length) === 0) {
                throw new Error("Advices is empty");
            }
            res.status(201).json({ message: "Advices found", data: userList });
        }
        catch (err) {
            res.status(404).json({ message: "Error", error: err.message });
        }
    });
}
exports.listUserAdvices = listUserAdvices;
function listAllUsers(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userAuthId = req.userId;
            const user = yield Users_model_1.default.findById(userAuthId);
            if (!user) {
                throw new Error("invalid User");
            }
            if ((user === null || user === void 0 ? void 0 : user.role) !== "admin") {
                throw new Error("Admin required");
            }
            const advices = yield advices_model_1.default.find()
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
        }
        catch (err) {
            res.status(404).json({ message: "Error", error: err.message });
        }
    });
}
exports.listAllUsers = listAllUsers;
function show(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userAuthId = req.userId;
            const { adviceId } = req.params;
            const advice = yield advices_model_1.default.findById(adviceId);
            const user = yield Users_model_1.default.findById(userAuthId);
            if (!(advice === null || advice === void 0 ? void 0 : advice.user)) {
                throw new Error("Advice not found");
            }
            if (!user) {
                throw new Error("Invalid User");
            }
            if (user.role === "client") {
                throw new Error("Invalid Role");
            }
            if (user.role !== "admin") {
                if ((advice === null || advice === void 0 ? void 0 : advice.user.toString()) !== userAuthId) {
                    throw new Error("Invalid User");
                }
            }
            const adviceShow = yield advices_model_1.default.findById(adviceId)
                .populate({
                path: "user",
                select: "-_id name email role profileImg",
            })
                .populate({
                path: "study",
                select: "-user -advice",
            });
            res.status(201).json({ message: "Advice found", data: adviceShow });
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
            const { studyId } = req.params;
            const data = req.body;
            const user = yield Users_model_1.default.findById(userAuthId);
            const study = yield studies_model_1.default.findById(studyId);
            if (!user) {
                throw new Error("Invalid User");
            }
            if (!study) {
                throw new Error("Invalid Study");
            }
            if (user.role === "client") {
                throw new Error("Invalid Role");
            }
            if (study.advice !== undefined) {
                throw new Error("Advice Already Created");
            }
            const newAdvice = Object.assign(Object.assign({}, data), { user: userAuthId, study: studyId });
            const adviceCreate = yield advices_model_1.default.create(newAdvice);
            user.advices.push(adviceCreate._id);
            study.advice = adviceCreate._id;
            yield user.save({ validateBeforeSave: false });
            yield study.save({ validateBeforeSave: false });
            res.status(201).json({ message: "Advice Created", data: data });
        }
        catch (err) {
            res.status(400).json({
                message: "Advice could not be created",
                error: err.message,
            });
        }
    });
}
exports.create = create;
