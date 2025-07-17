"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../controllers/user"));
const userRouter = express_1.default.Router();
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
userRouter.post("/register", user_1.default.register);
userRouter.post("/login", user_1.default.login);
exports.default = userRouter;
