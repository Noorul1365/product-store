"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user")); // Adjust path if needed
const userAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        //req.headers.authorization?.split(" ")[1]
        const token = req.headers.authorization || // Bearer token
            ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token); // Cookie token
        // console.log("Token:", token);
        if (!token) {
            return res
                .status(401)
                .json({ success: false, message: "Access Denied. No token provided." });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        ;
        if (!decoded) {
            return res
                .status(400)
                .send({ code: 400, message: "Failed to authenticate token" });
        }
        const foundUser = yield user_1.default.findById(decoded.user_id);
        if (!foundUser) {
            return res.status(400).send({ code: 400, message: "User not found" });
        }
        req.userID = decoded.user_id;
        req.userRole = decoded.user_role;
        next();
    }
    catch (error) {
        return res
            .status(401)
            .json({ success: false, message: "Invalid or expired token." });
    }
});
exports.userAuth = userAuth;
