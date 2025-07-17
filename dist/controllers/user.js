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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../models/user")); // Adjust path if needed
const helper_1 = require("../utils/helper");
const validation_1 = require("../zod/validation");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class userController {
    constructor() {
        this.register = (0, helper_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const parsed = validation_1.userRegisterSchema.safeParse(req.body);
            if (!parsed.success) {
                throw parsed.error;
            }
            const { name, userName, email, roles, password, location } = parsed.data;
            const existingUser = yield user_1.default.findOne({ email });
            if (existingUser) {
                return (0, helper_1.responseHandler)(res, 400, "Email already in use");
            }
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const newUser = new user_1.default({
                name,
                userName,
                email,
                password: hashedPassword,
                roles,
                location,
            });
            const savedUser = yield newUser.save();
            const _a = savedUser.toObject(), { password: _ } = _a, userWithoutPassword = __rest(_a, ["password"]);
            return (0, helper_1.responseHandler)(res, 201, "User registered successfully", userWithoutPassword);
        }));
        this.login = (0, helper_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const parsed = validation_1.userLoginSchema.safeParse(req.body);
            if (!parsed.success) {
                throw parsed.error;
            }
            const { email, password } = parsed.data;
            const user = yield user_1.default.findOne({ email });
            if (!user) {
                return (0, helper_1.responseHandler)(res, 404, 'User not found');
            }
            const isMatch = yield bcrypt_1.default.compare(password, user.password);
            if (!isMatch) {
                return (0, helper_1.responseHandler)(res, 400, 'Invalid credentials');
            }
            const payload = { user_id: user._id, user_role: user.roles };
            const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: '90d' });
            user.accessToken = token;
            yield user.save();
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 24 * 60 * 60 * 1000, // 1 day
            });
            const _a = user.toObject(), { password: _ } = _a, userData = __rest(_a, ["password"]);
            return (0, helper_1.responseHandler)(res, 200, 'Login successful', {
                token,
                user: userData,
            });
        }));
    }
}
exports.default = new userController();
