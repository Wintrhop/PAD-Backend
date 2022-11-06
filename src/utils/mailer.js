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
exports.welcome = exports.verify = exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    },
});
const verify = (transporter) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield transporter.verify();
    if (connection) {
        console.log("Server is ready to take our messages");
    }
});
exports.verify = verify;
const styles = {
    box: `display:flex;
  justify-content: center;`,
    container: `width:30%;
  padding:15px;
  text-align: center;
  border-radius: 12px;
  border: 1px solid rgb(226, 224, 224);
  color: #2480af;
  `,
};
const welcome = (user) => {
    return {
        from: `"${process.env.MAIL_USERNAME}"<${process.env.MAIL_USER}>`,
        to: user.email,
        subject: "Bienvenido",
        html: `
    <div style="${styles.box}">
      <div style="${styles.container}">
          <h1> Bienvenido ${user.name}</h1>
          <p> Gracias por registrarse en Property advice ya puedes hacer uso de nuestra aplicacion. </p>
          
        </div>
        </div>
        
      `,
        text: `Bienvenido ${user.name}`,
    };
};
exports.welcome = welcome;
