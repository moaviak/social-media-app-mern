import asyncHandler from "express-async-handler";
import { CookieOptions, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { IUser } from "../types";

// @desc Authenticate a User
// @route PUT /api/auth/
// @access Public
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "All fields are required!" });
    return;
  }

  // Check for user
  const user = await User.findOne({ email });

  if (!user) {
    res.status(401).json({ message: "Invalid Email!" });
    return;
  }

  const match = await bcrypt.compare(password, user.password as string);

  if (!match) {
    res.status(401).json({ message: "Incorrect Password!" });
    return;
  }

  const { accessToken, refreshToken } = generateTokens(user);

  // Creating a secure cookie with refresh token
  res.cookie("jwt", refreshToken, {
    httpOnly: true, // accessible only by web server
    secure: true, // https
    sameSite: "none", // cross-site cookie
    maxAge: 1000 * 60 * 60 * 24 * 7, // cookie expiry: set to match rT
  });

  // Send access token containing user information
  res.status(200).json({ accessToken });
});

// @desc Register User
// @route POST /api/auth
// @access Public
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      res.status(400).json({ message: "All fields are required!" });
      return;
    }

    // Check if user exists
    const userExist = await User.findOne({ email }).lean().exec();

    if (userExist) {
      res.status(409).json({ message: "User already exists with the email" });
      return;
    }

    // Check for username duplicate
    const duplicate = await User.findOne({ username }).lean().exec();

    if (duplicate) {
      res.status(409).json({ message: "Username already taken" });
      return;
    }

    // Password Hash
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    if (user) {
      const { accessToken, refreshToken } = generateTokens(user);

      // Creating a secure cookie with refresh token
      res.cookie("jwt", refreshToken, {
        httpOnly: true, // accessible only by web server
        secure: true, // https
        sameSite: "none", // cross-site cookie
        maxAge: 1000 * 60 * 60 * 24 * 7, // cookie expiry: set to match rT
      });

      // Send access token containing user information
      res.status(201).json({ accessToken });
    } else {
      res.status(400).json({ message: "Invalid user data received" });
    }
  }
);

// @desc Refresh token
// @route GET /api/auth/refresh
// @access Public
export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
      res.status(401).json({ message: "Please Login Again" });
      return;
    }

    const refreshToken = cookies.jwt;

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, user: { username: string }) => {
        if (err) {
          res.status(403).json({ message: "Forbidden" });
          return;
        }

        const foundUser = await User.findOne({
          username: user.username,
        }).exec();

        if (!foundUser) {
          res.status(401).json({ message: "Unauthorized" });
          return;
        }

        const { accessToken } = generateTokens(foundUser);

        res.status(200).json({ accessToken });
      }
    );
  }
);

// @desc Logout
// @route DELETE /api/auth
// @access Public - just to clear cookie if exists
export const logout = (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
  res.json({ message: "Cookie cleared" });
};

const generateTokens = (user: IUser) => {
  const accessToken = jwt.sign(
    {
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    {
      username: user.username,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};
