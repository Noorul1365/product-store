import express from 'express';
import conversationController from '../controllers/conversation';
import { userAuth } from "../middlewares/jwtAuth";

const conversationRouter = express.Router();

conversationRouter.use(userAuth);

conversationRouter.post('/create', conversationController.createConversation);
conversationRouter.get('/get', conversationController.getUserConversations);

export default conversationRouter;