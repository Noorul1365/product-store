import { Request, Response } from "express";
import bcrypt from "bcrypt";
import userModel from "../models/user"; // Adjust path if needed
import { User as UserType } from "../types/types";
import { asyncHandler, responseHandler } from "../utils/helper";
import { userRegisterSchema, userLoginSchema } from "../zod/validation";
import jwt from 'jsonwebtoken';

class userController {

  register = asyncHandler(async (req: Request, res: Response) => {
    const parsed = userRegisterSchema.safeParse(req.body);
    if (!parsed.success) {
      throw parsed.error;
    }

    const { name, userName, email, roles, password, location } = parsed.data;

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return responseHandler(res, 400, "Email already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      name,
      userName,
      email,
      password: hashedPassword,
      roles,
      location,
    });

    const savedUser = await newUser.save();
    const { password: _, ...userWithoutPassword } = savedUser.toObject();

    return responseHandler(res, 201, "User registered successfully", userWithoutPassword);
  });

  login = asyncHandler(async(req: Request, res: Response) => {

    const parsed = userLoginSchema.safeParse(req.body);
    if (!parsed.success) {
      throw parsed.error;
    }

    const { email, password } = parsed.data;

    const user = await userModel.findOne({ email });
    if (!user) {
      return responseHandler(res, 404, 'User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return responseHandler(res, 400, 'Invalid credentials');
    }

    const payload = { user_id: user._id, user_role: user.roles };

    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '90d' });

    user.accessToken = token;
    await user.save();

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    const { password: _, ...userData } = user.toObject();
    return responseHandler(res, 200, 'Login successful', {
      token,
      user: userData,
    });

  })

}

export default new userController();
