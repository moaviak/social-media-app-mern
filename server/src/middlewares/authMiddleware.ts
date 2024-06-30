import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

interface DecodedToken {
  user: {
    id: string | Types.ObjectId;
    name: string;
    username: string;
    email: string;
    profilePicture: string;
    bio: string;
  };
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const token = authHeader?.split(" ")[1];

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err: Error, decoded: DecodedToken) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }

      req.body.user = decoded.user;
      next();
    }
  );
};
