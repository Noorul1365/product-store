import { Request, Response } from "express";
import messageModel from "../models/message";
import conversationModel from "../models/conversation";
import { asyncHandler, responseHandler } from "../utils/helper";

class MessageController {
  sendMessage = asyncHandler(async (req: Request, res: Response) => {
    const sender = req.userID;
    const { conversationId, text } = req.body;

    const message = await messageModel.create({ conversationId, sender, text });

    await conversationModel.findByIdAndUpdate(conversationId, {
      $push: { messages: message._id },
      lastMessage: message._id,
    });

    responseHandler(res, 201, "Message sent successfully", message);
  });

  getMessages = asyncHandler(async (req: Request, res: Response) => {
    const { conversationId } = req.query;
    const messages = await messageModel.find({ conversationId });
    responseHandler(res, 200, "Messages fetched", messages);
  });
}

export default new MessageController();
