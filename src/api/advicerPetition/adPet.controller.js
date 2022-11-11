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
exports.consultPetUser = exports.adminApproval = exports.create = exports.listAllAdPets = void 0;
const Users_model_1 = __importDefault(require("../Users/Users.model"));
const adPet_model_1 = __importDefault(require("./adPet.model"));
function listAllAdPets(req, res, next) {
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
            const adPets = yield adPet_model_1.default.find({ approvedBy: undefined }).populate({
                path: "user",
                select: "-_id -password -studies -advices -advicerPetition -advicersApproved",
            });
            if (adPets.length === 0) {
                throw new Error("Petitions for Advicer is empty");
            }
            res.status(201).json({ message: "Petitions found", data: adPets });
        }
        catch (err) {
            res.status(404).json({ message: "Error", error: err.message });
        }
    });
}
exports.listAllAdPets = listAllAdPets;
function create(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userAuthId = req.userId;
            const data = req.body;
            const user = yield Users_model_1.default.findById(userAuthId);
            if (!user) {
                throw new Error("Invalid User");
            }
            if (user.approved != undefined) {
                throw new Error("Petition already Created");
            }
            const newAdvicer = Object.assign(Object.assign({}, data), { user: userAuthId });
            const avicerPet = yield adPet_model_1.default.create(newAdvicer);
            user.advicerPetition = avicerPet._id;
            user.approved = false;
            yield user.save({ validateBeforeSave: false });
            res.status(201).json({ message: "Advicer Petition Created", data: data });
        }
        catch (err) {
            res.status(400).json({
                message: "Advicer Petition could not be created",
                error: err.message,
            });
        }
    });
}
exports.create = create;
function adminApproval(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userAuthId = req.userId;
            const { petitionId } = req.params;
            const userAdmin = yield Users_model_1.default.findById(userAuthId);
            if (!userAdmin) {
                throw new Error("Invalid User");
            }
            if ((userAdmin === null || userAdmin === void 0 ? void 0 : userAdmin.role) !== "admin") {
                throw new Error("Admin required");
            }
            const advicerPetition = yield adPet_model_1.default.findById(petitionId);
            if (!advicerPetition) {
                throw new Error("Invalid Petition");
            }
            let { user } = advicerPetition;
            if (user.approved === true) {
                throw new Error("Petition already approved");
            }
            const advicerUser = yield Users_model_1.default.findById(user._id);
            if (!advicerUser) {
                throw new Error("Invalid User");
            }
            advicerUser.approved = true;
            advicerUser.role = "advicer";
            advicerPetition.approvedBy = userAdmin._id;
            userAdmin.advicersApproved.push(advicerPetition._id);
            yield advicerUser.save({ validateBeforeSave: false });
            yield advicerPetition.save({ validateBeforeSave: false });
            yield userAdmin.save({ validateBeforeSave: false });
            res.status(201).json({ message: "Advicer Petition approved", data: advicerPetition });
        }
        catch (err) {
            res.status(400).json({
                message: "Advicer Petition could not be approved",
                error: err.message,
            });
        }
    });
}
exports.adminApproval = adminApproval;
function consultPetUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userAuthId = req.userId;
            const user = yield Users_model_1.default.findById(userAuthId)
                .select("-_id role approved advicerPetition");
            res.status(201).json({ message: "consult Pet done", data: user });
        }
        catch (err) {
            res.status(404).json({ message: "Error", error: err.message });
        }
    });
}
exports.consultPetUser = consultPetUser;
