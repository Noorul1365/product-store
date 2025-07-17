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
exports.registerSocketServer = void 0;
const socket_io_1 = require("socket.io");
const conversation_1 = __importDefault(require("./models/conversation"));
const message_1 = __importDefault(require("./models/message"));
const registerSocketServer = (httpServer) => {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);
        socket.on("room-join", (_a) => __awaiter(void 0, [_a], void 0, function* ({ roomId }) {
            const [senderId, receiverId] = roomId.split("-");
            const sorted = [senderId, receiverId].sort();
            const room = `${sorted[0]}-${sorted[1]}`;
            socket.join(room);
            console.log(`Joined room: ${room}`);
            let conversation = yield conversation_1.default.findOne({
                members: { $all: [senderId, receiverId] },
            });
            if (!conversation) {
                conversation = yield conversation_1.default.create({
                    members: [senderId, receiverId],
                });
            }
        }));
        socket.on("send-message", (_a) => __awaiter(void 0, [_a], void 0, function* ({ message, room }) {
            const [senderId, receiverId] = room.split("-");
            const sorted = [senderId, receiverId].sort();
            const roomId = `${sorted[0]}-${sorted[1]}`;
            let conversation = yield conversation_1.default.findOne({
                members: { $all: [senderId, receiverId] },
            });
            if (!conversation) {
                conversation = yield conversation_1.default.create({
                    members: [senderId, receiverId],
                });
            }
            const newMessage = yield message_1.default.create({
                conversationId: conversation._id,
                sender: senderId,
                text: message,
            });
            conversation.messages.push(newMessage._id);
            conversation.lastMessage = newMessage._id;
            yield conversation.save();
            io.to(roomId).emit("rcv_message", {
                senderId,
                message,
                conversationId: conversation._id,
                createdAt: newMessage.createdAt,
            });
        }));
    });
};
exports.registerSocketServer = registerSocketServer;
