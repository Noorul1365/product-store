import { Server } from "socket.io";
import conversationModel from "./models/conversation";
import messageModel from "./models/message";
import cors from "cors";

export const registerSocketServer = (httpServer: any) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("room-join", async ({ roomId }) => {
      const [senderId, receiverId] = roomId.split("-");
      const sorted = [senderId, receiverId].sort();
      const room = `${sorted[0]}-${sorted[1]}`;

      socket.join(room);
      console.log(`Joined room: ${room}`);

      let conversation = await conversationModel.findOne({
        members: { $all: [senderId, receiverId] },
      });

      if (!conversation) {
        conversation = await conversationModel.create({
          members: [senderId, receiverId],
        });
      }
    });

    socket.on("send-message", async ({ message, room }) => {
      const [senderId, receiverId] = room.split("-");
      const sorted = [senderId, receiverId].sort();
      const roomId = `${sorted[0]}-${sorted[1]}`;

      let conversation = await conversationModel.findOne({
        members: { $all: [senderId, receiverId] },
      });

      if (!conversation) {
        conversation = await conversationModel.create({
          members: [senderId, receiverId],
        });
      }

      const newMessage = await messageModel.create({
        conversationId: conversation._id,
        sender: senderId,
        text: message,
      });

      conversation.messages.push(newMessage._id);
      conversation.lastMessage = newMessage._id;
      await conversation.save();

      io.to(roomId).emit("rcv_message", {
        senderId,
        message,
        conversationId: conversation._id,
        createdAt: newMessage.createdAt,
      });
    });
  });
};
