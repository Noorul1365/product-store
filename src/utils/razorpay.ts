import Razorpay from 'razorpay';

import dotenv from 'dotenv'; 

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const generateReceipt = (): string => {
  return 'rcpt_' + Math.random().toString(36).substring(2, 10);
};

export default razorpay;
