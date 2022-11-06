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
exports.cleanup = exports.disconnected = exports.connect = exports.connection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        if (exports.connection)
            return;
        const mongoUri = process.env.MONGO_URI;
        const mongoTest = process.env.MONGO_URI_TEST;
        exports.connection = mongoose_1.default.connection;
        exports.connection.once("open", () => {
            console.log("connection with mongo OK");
        });
        exports.connection.on("disconnected", () => {
            console.log("Disconnected succesfull");
        });
        exports.connection.on("error", (err) => {
            console.log("something went wrong!", err);
        });
        yield mongoose_1.default.connect(mongoUri);
    });
}
exports.connect = connect;
function disconnected() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!exports.connection)
            return;
        yield mongoose_1.default.disconnect();
    });
}
exports.disconnected = disconnected;
function cleanup() {
    return __awaiter(this, void 0, void 0, function* () {
        for (const collection in exports.connection.collections) {
            yield exports.connection.collections[collection].deleteMany({});
        }
    });
}
exports.cleanup = cleanup;
