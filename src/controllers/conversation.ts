import conversationModel from '../models/conversation';
import { asyncHandler, responseHandler }from '../utils/helper';
import { Request, Response } from 'express';

class ConversationController {
    createConversation = asyncHandler(async (req: Request, res: Response) => {
        const senderId = req.userID;
        console.log("Sender ID:", senderId);
        const { receiverId } = req.body;

        let conversation = await conversationModel.findOne({
            members: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
            conversation = await conversationModel.create({ members: [senderId, receiverId] });
        }

        responseHandler(res, 200, 'Conversation retrieved', conversation);
    })

    getUserConversations = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.userID;
        const conversations = await conversationModel.find({ members: userId }).populate('lastMessage');
        responseHandler(res, 200, 'All conversations retrieved', conversations);
    });

}

export default new ConversationController();