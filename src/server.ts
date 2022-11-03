
import app from "./app";
import {connect} from "./db";


const port = process.env.PORT;
connect();

app.listen(port, ()=> console.log('Server Running Ok'));