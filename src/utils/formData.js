"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formData = void 0;
const busboy_1 = __importDefault(require("busboy"));
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.STORAGE_NAME,
    api_key: process.env.STORAGE_API_KEY,
    api_secret: process.env.STORAGE_API_SECRET,
});
const formData = (req, res, next) => {
    let uploadingFile = false;
    let uploadingCount = 0;
    const done = () => {
        if (uploadingFile)
            return;
        if (uploadingCount > 0)
            return;
        next();
    };
    const bb = (0, busboy_1.default)({ headers: req.headers });
    req.body = {};
    // Captura de partes que no son un archivo
    bb.on("field", (key, val) => {
        req.body[key] = val;
    });
    // Capturas partes que son archivo
    bb.on("file", (key, stream) => {
        uploadingFile = true;
        uploadingCount++;
        const cloud = cloudinary_1.v2.uploader.upload_stream({ upload_preset: "pad-preset" }, (err, res) => {
            if (err)
                throw new Error("Something went wrong!");
            req.body[key] = res === null || res === void 0 ? void 0 : res.secure_url;
            uploadingFile = false;
            uploadingCount--;
            done();
        });
        stream.on("data", (data) => {
            cloud.write(data);
        });
        stream.on("end", () => {
            cloud.end();
        });
    });
    bb.on("finish", () => {
        done();
    });
    req.pipe(bb);
};
exports.formData = formData;
