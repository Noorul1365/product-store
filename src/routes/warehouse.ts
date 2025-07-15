import express from "express";
import WarehouseController from "../controllers/warehouseController";
import { userAuth } from "../middlewares/jwtAuth";

const warehouseRouter = express.Router();

warehouseRouter.use(userAuth); // Apply authentication middleware to all routes

warehouseRouter.post("/create", WarehouseController.createWarehouse);
warehouseRouter.get("/getAll", WarehouseController.getAll);
warehouseRouter.get("/details", WarehouseController.getById);
warehouseRouter.put("/update", WarehouseController.update);


export default warehouseRouter;
