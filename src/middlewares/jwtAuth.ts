import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import userModel from "../models/user"; // Adjust path if needed

export interface AuthRequest extends Request {
  user?: any;
}

interface DecodedToken {
    user_id: string;
    user_role: string;
}

declare global {
    namespace Express {
      interface Request {
        userID?: string;
        userRole?: string;
      }
    }
}

export const userAuth = async(req: AuthRequest,res: Response,next: NextFunction) => {
  try {
    //req.headers.authorization?.split(" ")[1]
    const token =
      req.headers.authorization|| // Bearer token
      req.cookies?.token; // Cookie token

    // console.log("Token:", token);

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Access Denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;;

    if (!decoded) {
      return res
        .status(400)
        .send({ code: 400, message: "Failed to authenticate token" });
    }

    const foundUser = await userModel.findById(decoded.user_id);

     if (!foundUser) {
        return res.status(400).send({ code: 400, message: "User not found" });
    }

    req.userID = decoded.user_id;
    req.userRole = decoded.user_role;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token." });
  }
};
