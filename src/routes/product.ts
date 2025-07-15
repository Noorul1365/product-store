import express from "express";
import ProductController from "../controllers/productController";
import { userAuth } from "../middlewares/jwtAuth";

const productRouter = express.Router();

productRouter.use(userAuth); // Apply authentication middleware to all routes

productRouter.post("/create", ProductController.create);
productRouter.get("/getAll", ProductController.getAll);
productRouter.get("/details", ProductController.getById);
productRouter.put("/update", ProductController.update);
productRouter.delete("/delete", ProductController.delete);


export default productRouter;