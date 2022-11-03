import mongoose from "mongoose";

export let connection: mongoose.Connection;
export async function connect(): Promise<void> {
  if (connection) return;
  const mongoUri = process.env.MONGO_URI as string;
  const mongoTest = process.env.MONGO_URI_TEST as string;
  
  connection = mongoose.connection;

  connection.once("open", () => {
    console.log("connection with mongo OK");
  });
  connection.on("disconnected", () => {
    console.log("Disconnected succesfull");
  });
  connection.on("error", (err) => {
    console.log("something went wrong!", err);
  });
  await mongoose.connect(mongoUri);
}
export async function disconnected(): Promise<void>{
    if (!connection) return;
  await mongoose.disconnect();
}
export async function cleanup(): Promise<void> {
    for (const collection in connection.collections) {
        await connection.collections[collection].deleteMany({});
      }
}
