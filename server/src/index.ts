import dotenv from "dotenv";
import express, { Express } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import connectDB from "./config/dbConn";
import { errorHandler } from "./middlewares/errorMiddleware";

import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import postRoutes from "./routes/postRoutes";
import corsOptions from "./config/corsOptions";

// Configuration
dotenv.config();
const PORT = process.env.PORT || 3001;
const app: Express = express();
connectDB();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log(`Connected to MongoDB`);
  app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});
