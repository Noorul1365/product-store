"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = __importDefault(require("../controllers/productController"));
const jwtAuth_1 = require("../middlewares/jwtAuth");
const productRouter = express_1.default.Router();
productRouter.use(jwtAuth_1.userAuth); // Apply authentication middleware to all routes
productRouter.post("/create", productController_1.default.create);
productRouter.get("/getAll", productController_1.default.getAll);
productRouter.get("/details", productController_1.default.getById);
productRouter.put("/update", productController_1.default.update);
productRouter.delete("/delete", productController_1.default.delete);
exports.default = productRouter;
