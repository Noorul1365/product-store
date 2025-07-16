import express from "express";
import http from 'http';
import path from 'path';
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import warehouseRoutes from "./routes/warehouse";
import productRoutes from "./routes/product";
import orderRoutes from "./routes/order";
import conversationRoutes from "./routes/conversation";
import messageRoutes from "./routes/message";
import mongoose from "mongoose";
import connectDB from "./config/db";
import { errorHandler } from './utils/error';
import cookieParser from 'cookie-parser';
import { registerSocketServer } from './socket';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

const server = http.createServer(app);
// registerSocketServer(server);


app.use(express.static(path.join(__dirname, './public')));
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/warehouse", warehouseRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/conversation", conversationRoutes);
app.use("/api/message", messageRoutes);
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello from TypeScript + Express");
});

registerSocketServer(server);

app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});