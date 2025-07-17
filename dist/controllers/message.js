"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const message_1 = __importDefault(require("../models/message"));
const conversation_1 = __importDefault(require("../models/conversation"));
const helper_1 = require("../utils/helper");
class MessageController {
    constructor() {
        this.sendMessage = (0, helper_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const sender = req.userID;
            const { conversationId, text } = req.body;
            const message = yield message_1.default.create({ conversationId, sender, text });
            yield conversation_1.default.findByIdAndUpdate(conversationId, {
                $push: { messages: message._id },
                lastMessage: message._id,
            });
            (0, helper_1.responseHandler)(res, 201, "Message sent successfully", message);
        }));
        this.getMessages = (0, helper_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { conversationId } = req.query;
            const messages = yield message_1.default.find({ conversationId });
            (0, helper_1.responseHandler)(res, 200, "Messages fetched", messages);
        }));
    }
}
exports.default = new MessageController();
