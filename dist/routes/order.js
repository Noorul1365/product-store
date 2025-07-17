"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_1 = __importDefault(require("../controllers/order"));
const jwtAuth_1 = require("../middlewares/jwtAuth");
const orderRouter = express_1.default.Router();
orderRouter.use(jwtAuth_1.userAuth);
orderRouter.post('/create', order_1.default.createOrder);
orderRouter.post('/verify', order_1.default.verifyPayment);
exports.default = orderRouter;
