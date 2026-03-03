import Conversation from '../models/Conversation.model.js';
import Message from '../models/Message.model.js';
import { updateUnreadCounts } from '../utils/unreadCount.util.js';
export const sendDirectMessage = async (req, res) => {
    try {
        const { recipientId, content, imgUrl } = req.body;
        const userId = req.user.id;
        const conversation = await Conversation.findOne({
            type: 'direct',
            participants: { $all: [{ userId }, { userId: recipientId }] }
        });
         if (!conversation) {
             return res
                 .status(404)
                 .json({ message: 'Cuộc trò chuyện không tồn tại' });
        } 
        if(!content && !imgUrl) {
            return res.status(400).json({message:"Tin nhắn không được để trống"});
        }
        const lastMessage = {
            content,
            imgUrl,
            senderId: userId,
            createdAt: new Date()
        };
       
        await updateUnreadCounts(conversation, userId, lastMessage);

        const message = new Message({
            conversationId: conversation._id,
            senderId: userId,
            content,
            imgUrl
        });
        await message.save();
       


    } catch (error) {
        console.error('Lỗi khi gửi tin nhắn trực tiếp:', error);
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};
export const sendGroupMessage = async (req, res) => {
    try {
         const { conversationId, content, imgUrl } = req.body;
        const userId = req.user.id;
        const conversation = await Conversation.findOne({
            _id: conversationId,
        });
        if (!conversation) {
            return res
                .status(404)
                .json({ message: 'Cuộc trò chuyện không tồn tại' });
        }
        if(!content && !imgUrl) {
            return res.status(400).json({message:"Tin nhắn không được để trống"});
        }
        const lastMessage = {
            content,
            imgUrl,
            senderId: userId,
            createdAt: new Date()
        };
        await updateUnreadCounts(conversation, userId, lastMessage);
        const message = new Message({
            conversationId,
            senderId: userId,
            content,
            imgUrl
        });
        await message.save();


    } catch (error) {
        console.error('Lỗi khi gửi tin nhắn nhóm:', error);
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};