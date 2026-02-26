import express from 'express';
const router = express.Router();
import {
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    getFriendRequests,
    getAllFriends
} from '../controllers/friendController.js';



router.post("/requests", sendFriendRequest);
router.post("/requests/:requestId/accept", acceptFriendRequest);
router.post('/requests/:requestId/decline', declineFriendRequest);
router.get("/requests", getFriendRequests);
router.post("/", getAllFriends);