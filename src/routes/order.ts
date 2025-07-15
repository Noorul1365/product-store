import express from 'express';
import orderController from '../controllers/order';
import { userAuth } from "../middlewares/jwtAuth";

const orderRouter = express.Router();

orderRouter.use(userAuth);

orderRouter.post('/create', orderController.createOrder);
orderRouter.post('/verify', orderController.verifyPayment);

export default orderRouter;
