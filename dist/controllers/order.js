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
const helper_1 = require("../utils/helper");
const razorpay_1 = __importDefault(require("../utils/razorpay"));
const product_1 = __importDefault(require("../models/product"));
const order_1 = __importDefault(require("../models/order"));
const crypto_1 = __importDefault(require("crypto"));
const razorpay_2 = require("../utils/razorpay");
class OrderController {
    constructor() {
        this.createOrder = (0, helper_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = req.userID;
            console.log("User ID:", user);
            const { cartItems, address } = req.body;
            if (!Array.isArray(cartItems) || cartItems.length === 0) {
                return (0, helper_1.responseHandler)(res, 400, "Cart is empty");
            }
            let totalPrice = 0;
            for (const item of cartItems) {
                const product = yield product_1.default.findById(item.productId);
                if (!product) {
                    return (0, helper_1.responseHandler)(res, 404, `Product ${item.productId} not found`);
                }
                totalPrice += product.price * item.quantity;
            }
            const receipt = (0, razorpay_2.generateReceipt)();
            const razorpayOrder = yield razorpay_1.default.orders.create({
                amount: totalPrice * 100, // amount in paise
                currency: "INR",
                receipt,
            });
            const newOrder = yield order_1.default.create({
                user,
                cartItems,
                address,
                orderId: razorpayOrder.id,
            });
            return (0, helper_1.responseHandler)(res, 201, "Order created successfully", {
                razorpayOrder,
                orderId: newOrder._id,
            });
        }));
        this.verifyPayment = (0, helper_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
            if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
                return (0, helper_1.responseHandler)(res, 400, "Missing payment verification details");
            }
            const generated_signature = crypto_1.default
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                .update(`${razorpay_order_id}|${razorpay_payment_id}`)
                .digest("hex");
            if (generated_signature === razorpay_signature) {
                return (0, helper_1.responseHandler)(res, 200, "Payment verified successfully", {
                    razorpay_order_id,
                    razorpay_payment_id,
                });
            }
            else {
                return (0, helper_1.responseHandler)(res, 400, "Invalid payment signature");
            }
        }));
    }
}
exports.default = new OrderController();
