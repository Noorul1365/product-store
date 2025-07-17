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
const conversation_1 = __importDefault(require("../models/conversation"));
const helper_1 = require("../utils/helper");
class ConversationController {
    constructor() {
        this.createConversation = (0, helper_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const senderId = req.userID;
            console.log("Sender ID:", senderId);
            const { receiverId } = req.body;
            let conversation = yield conversation_1.default.findOne({
                members: { $all: [senderId, receiverId] },
            });
            if (!conversation) {
                conversation = yield conversation_1.default.create({ members: [senderId, receiverId] });
            }
            (0, helper_1.responseHandler)(res, 200, 'Conversation retrieved', conversation);
        }));
        this.getUserConversations = (0, helper_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.userID;
            const conversations = yield conversation_1.default.find({ members: userId }).populate('lastMessage');
            (0, helper_1.responseHandler)(res, 200, 'All conversations retrieved', conversations);
        }));
    }
}
exports.default = new ConversationController();
