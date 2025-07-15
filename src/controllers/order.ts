import { Request, Response } from "express";
import mongoose from "mongoose";
import { asyncHandler, responseHandler } from "../utils/helper";
import razorpay from "../utils/razorpay";
import productModel from "../models/product";
import orderModel from "../models/order";
import crypto from "crypto";

import { generateReceipt } from "../utils/razorpay";

class OrderController {
  createOrder = asyncHandler(async (req: Request, res: Response) => {
    const user = req.userID;
    console.log("User ID:", user);
    const { cartItems, address } = req.body;

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return responseHandler(res, 400, "Cart is empty");
    }

    let totalPrice = 0;

    for (const item of cartItems) {
      const product = await productModel.findById(item.productId);
      if (!product) {
        return responseHandler(res, 404, `Product ${item.productId} not found`);
      }

      totalPrice += product!.price * item.quantity;
    }

    const receipt = generateReceipt();

    const razorpayOrder = await razorpay.orders.create({
      amount: totalPrice * 100, // amount in paise
      currency: "INR",
      receipt,
    });

    const newOrder = await orderModel.create({
      user,
      cartItems,
      address,
      orderId: razorpayOrder.id,
    });

    return responseHandler(res, 201, "Order created successfully", {
      razorpayOrder,
      orderId: newOrder._id,
    });
  });

  verifyPayment = asyncHandler(async (req: Request, res: Response) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return responseHandler(res, 400, "Missing payment verification details");
    }

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      return responseHandler(res, 200, "Payment verified successfully", {
        razorpay_order_id,
        razorpay_payment_id,
      });
    } else {
      return responseHandler(res, 400, "Invalid payment signature");
    }
  });
}

export default new OrderController();
