"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const message_1 = __importDefault(require("../controllers/message"));
const jwtAuth_1 = require("../middlewares/jwtAuth");
const router = express_1.default.Router();
router.use(jwtAuth_1.userAuth);
router.post('/sendMessage', message_1.default.sendMessage);
router.get('/getMessages', message_1.default.getMessages);
exports.default = router;
