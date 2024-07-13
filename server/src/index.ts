import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/dbConn";
import { httpServer } from "./app";

// Configuration
dotenv.config();
const PORT = process.env.PORT || 3001;
connectDB();

const startServer = () => {
  httpServer.listen(PORT, () => {
    console.log("Server is running on port: " + PORT);
  });
};

mongoose.connection.once("open", () => {
  console.log(`Connected to MongoDB`);
  startServer();
});

mongoose.connection.on("error", (err) => {
  console.log("MongoDB connection error: " + err);
});
