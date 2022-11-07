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
exports.createAdvicer = exports.advicerPetition = exports.destroy = exports.update = exports.list = exports.signIn = exports.signUp = void 0;
const Users_model_1 = __importDefault(require("./Users.model"));
const mailer_1 = require("../../utils/mailer");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passwordRegex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$");
function signUp(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, name, password } = req.body;
            if (!passwordRegex.test(password)) {
                throw new Error(`Password must have at least 8 characters, At least one upper case,
       At least one lower case, At least one digit, At least one special character`);
            }
            const userExist = yield Users_model_1.default.findOne({ email });
            if (userExist) {
                throw new Error("Email already exist");
            }
            const encPassword = yield bcrypt_1.default.hash(password, 8);
            const newUser = {
                name,
                email,
                password: encPassword,
                role: "client",
            };
            const user = yield Users_model_1.default.create(newUser);
            const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.SECRET_KEY, {
                expiresIn: 60 * 60 * 24,
            });
            console.log('funciona');
            const role = user.role;
            const profileImgUser = "https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png";
            yield mailer_1.transporter.sendMail((0, mailer_1.welcome)(newUser));
            res.status(201).json({
                message: "user created successfully",
                data: { name, email, token, role, profileImgUser },
            });
        }
        catch (err) {
            res
                .status(400)
                .json({ message: "user could not be created", error: err.message });
        }
    });
}
exports.signUp = signUp;
function signIn(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const user = yield Users_model_1.default.findOne({ email });
            if (!user) {
                throw new Error("Email or password invalid");
            }
            const isValid = yield bcrypt_1.default.compare(password, user.password);
            if (!isValid) {
                throw new Error("Email or password invalid");
            }
            const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.SECRET_KEY, {
                expiresIn: 60 * 60 * 24,
            });
            const role = user.role;
            const name = user.name;
            if (user.profileImg.length === 0) {
                user.profileImg =
                    "https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png";
            }
            const profileImg = user.profileImg;
            res.status(201).json({
                message: "User Login Successfully",
                data: { name, email, token, role, profileImg },
            });
        }
        catch (err) {
            res
                .status(400)
                .json({ message: "User could not login", error: err.message });
        }
    });
}
exports.signIn = signIn;
function list(req, res, next) {
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
            const users = yield Users_model_1.default.find().select("-_id -password");
            if (users.length === 0) {
                throw new Error("Users empty");
            }
            res.status(201).json({ message: "Users found", data: users });
        }
        catch (err) {
            res.status(404).json({ message: "Error", error: err.message });
        }
    });
}
exports.list = list;
function update(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = req.body;
            const userAuthId = Users_model_1.default.findById(req.userId).select("-_id -password");
            if (!userAuthId) {
                throw new Error("User not found");
            }
            const user = yield Users_model_1.default.findByIdAndUpdate(req.userId, data, { new: true });
            res.status(200).json({ message: "User Updated", data: data });
        }
        catch (err) {
            res
                .status(400)
                .json({ message: "User could not be Updated", error: err.message });
        }
    });
}
exports.update = update;
function destroy(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = req.body;
            const userAuthId = Users_model_1.default.findById(req.userId);
            if (!userAuthId) {
                throw new Error("User not found");
            }
            const user = yield Users_model_1.default.findByIdAndDelete(req.userId);
            res.status(200).json({ message: "User Deleted", data: user });
        }
        catch (err) {
            res
                .status(400)
                .json({ message: "User could not be Updated", error: err.message });
        }
    });
}
exports.destroy = destroy;
function advicerPetition(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
        }
        catch (err) {
        }
    });
}
exports.advicerPetition = advicerPetition;
function createAdvicer(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
        }
        catch (err) { }
    });
}
exports.createAdvicer = createAdvicer;
