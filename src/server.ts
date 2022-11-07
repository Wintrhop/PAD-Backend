
import app from "./app";
import {connect} from "./db";
import { transporter, verify } from "./utils/mailer";


const port = process.env.PORT || 8080;
connect();
verify(transporter);

app.listen(port, ()=> console.log('Server Running Ok'));