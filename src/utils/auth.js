"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        throw new Error("Session expired");
    }
    const [_, token] = authorization.split(" ");
    if (!token) {
        return res.status(401).json({
            ok: false,
            message: 'No token provided'
        });
    }
    try {
        const { id } = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        req.userId = id;
    }
    catch (error) {
        return res.status(401).json({
            ok: false,
            message: 'Invalid token'
        });
    }
    next();
};
exports.auth = auth;
