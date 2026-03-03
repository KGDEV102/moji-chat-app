import express from 'express';
import {
    checkFriendShip,
    checkGroupMemberShip
} from '../middleware/checkFriendShip.middleware';
import {
    sendDirectMessage,
    sendGroupMessage
} from '../controller/message.controller.js';
const router = express.Router();
router.post("/direct",checkFriendShip,sendDirectMessage);
router.post("/group",checkFriendShip,checkGroupMemberShip,sendGroupMessage);
export default router;