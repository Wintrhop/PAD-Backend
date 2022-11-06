"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_1 = require("./db");
const mailer_1 = require("./utils/mailer");
const port = process.env.PORT;
(0, db_1.connect)();
(0, mailer_1.verify)(mailer_1.transporter);
app_1.default.listen(port, () => console.log('Server Running Ok'));
