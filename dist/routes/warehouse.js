"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const warehouseController_1 = __importDefault(require("../controllers/warehouseController"));
const jwtAuth_1 = require("../middlewares/jwtAuth");
const warehouseRouter = express_1.default.Router();
warehouseRouter.use(jwtAuth_1.userAuth); // Apply authentication middleware to all routes
warehouseRouter.post("/create", warehouseController_1.default.createWarehouse);
warehouseRouter.get("/getAll", warehouseController_1.default.getAll);
warehouseRouter.get("/details", warehouseController_1.default.getById);
warehouseRouter.put("/update", warehouseController_1.default.update);
warehouseRouter.delete("/delete", warehouseController_1.default.delete);
exports.default = warehouseRouter;
