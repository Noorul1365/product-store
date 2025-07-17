import express from "express";
import userController from "../controllers/user";

const userRouter = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - User
 *     description: Returns all users
 *     responses:
 *       200:
 *         description: A successful response
 */

userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);

export default userRouter;
