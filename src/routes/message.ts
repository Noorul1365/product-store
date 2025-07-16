import express from 'express';
import messageController from '../controllers/message';
import { userAuth } from "../middlewares/jwtAuth";

const router = express.Router();

router.use(userAuth);

router.post('/sendMessage', messageController.sendMessage);
router.get('/getMessages', messageController.getMessages);

export default router;