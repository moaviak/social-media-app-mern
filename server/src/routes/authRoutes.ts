import express from "express";
import {
  loginUser,
  logout,
  refreshToken,
  registerUser,
} from "../controllers/authController";

const router = express.Router();

router.route("/").put(loginUser).post(registerUser).delete(logout);
router.get("/refresh", refreshToken);
export default router;
