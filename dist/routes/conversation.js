"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const conversation_1 = __importDefault(require("../controllers/conversation"));
const jwtAuth_1 = require("../middlewares/jwtAuth");
const conversationRouter = express_1.default.Router();
conversationRouter.use(jwtAuth_1.userAuth);
conversationRouter.post('/create', conversation_1.default.createConversation);
conversationRouter.get('/get', conversation_1.default.getUserConversations);
exports.default = conversationRouter;
