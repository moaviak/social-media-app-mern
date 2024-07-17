import express from "express";
import {
  getAllChats,
  getAllMessages,
  sendMessage,
} from "../controllers/chatController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.use(protect);

router.get("/", getAllChats);

router.get("/:id", getAllMessages);

router.post("/:id", sendMessage);

export default router;
