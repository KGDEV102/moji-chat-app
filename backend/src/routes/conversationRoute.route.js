import express from 'express';
import { checkFriendShip } from '../middleware/friend.middleware.js';
const router = express.Router();
import {
    createConversation,
    getConversations,
    getMessages
} from '../controllers/conversationController.js';
router.post('/', checkFriendShip, createConversation);
router.get('/', getConversations);
router.get('/:conversationId/messages', getMessages);
export default router;