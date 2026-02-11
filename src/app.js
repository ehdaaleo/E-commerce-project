import express from "express";
import connectDB from "./config/db.js";
export const app = express();
app.use(express.json());

const startServer = async () => {
  await connectDB();
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
};

startServer();