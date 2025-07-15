import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import warehouseRoutes from "./routes/warehouse";
import mongoose from "mongoose";
import connectDB from "./config/db";
import { errorHandler } from './utils/error';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/warehouse", warehouseRoutes);
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello from TypeScript + Express");
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});