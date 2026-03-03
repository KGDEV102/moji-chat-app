import Friend from '../models/Friend.model.js';
import Conversation from '../models/Conversation.model.js';
export const pair = (a, b) => a > b ? [b, a] : [a, b];
export const checkFriendShip = async (req, res, next) => {
    const recipientId = req.body.recipientId;
    const userId = req.user.id;
    const memberIds = req.body.memberIds;
    if (!recipientId || memberIds.length === 0) {
        return res.status(400).json({message:"Thiếu recipiientId hoặc memberIds"});
    }
    const [userA, userB] = pair(userId, recipientId);
    const isFriend = await Friend.findOne({userA, userB});
    if (!isFriend) {
        return res.status(403).json({message:"Bạn không phải là bạn bè của người nhận"});
    }
    const notFriends = memberIds.every(async memberId => {
        const [userA, userB] = pair(userId, memberId);
        return !await Friend.findOne({userA, userB});
    });
    if (notFriends) {
        return res.status(403).json({message:"Bạn chỉ có thể thêm bạn bè vào nhóm"});
    }
    next();
}
export const checkGroupMemberShip = async (req, res, next) => {
    const conversationId = req.body.conversationId;
    const userId = req.user.id;
   
    const isMember = conversation.participants.some(p => p.userId.toString() === userId.toString());
    if (!isMember) {
        return res.status(403).json({message:"Bạn không phải là thành viên của cuộc trò chuyện"});
    }
    next();
}