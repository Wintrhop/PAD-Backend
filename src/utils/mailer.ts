import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

export const verify = async (transporter: any) => {
  const connection = await transporter.verify();

  if (connection) {
    console.log("Server is ready to take our messages");
  }
};
const styles = {
  box:`display:flex;
  justify-content: center;`,
  container: `width:30%;
  padding:15px;
  text-align: center;
  border-radius: 12px;
  border: 1px solid rgb(226, 224, 224);
  color: #2480af;
  `,
};

export const welcome = (user: any) => {
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
