import Conversation from '../models/Conversation.model.js';
import Message from '../models/Message.model.js';

export const createConversation = async (req, res) => {
    try {
        const { type, recipientId, memberIds, name, createdBy } = req.body;
        const userId = req.user.id;
        let conversation;
        if (!type) {
            return res.status(400).json({ message: 'Thiếu trường type' });
        }
        if (type === 'direct') {
            if (!recipientId) {
                return res.status(400).json({ message: 'Thiếu recipientId cho cuộc trò chuyện trực tiếp' });
            }
            conversation = new Conversation({
                type,
                participants: [{ userId }, { userId: recipientId }],
                lastMessageAt: new Date()
            });
            await conversation.save();
           
        }
        else if (type === 'group') {
            if (!name || !createdBy || !memberIds || memberIds.length === 0) {
                return res.status(400).json({ message: 'Thiếu thông tin cần thiết cho cuộc trò chuyện nhóm' });
            }
            conversation = new Conversation({
                type,
                participants: [{ userId: createdBy }, ...memberIds.map(id => ({ userId: id }))],
                group: { name, createdBy },
                lastMessageAt: new Date()
            });
            await conversation.save();
        }
        conversation = await Conversation.findById(conversation._id)
            .populate('participants.userId', 'username displayName')
            .populate('lastMessage.senderId', 'username displayName')
            .populate('seenBy', 'username displayName');
        res.status(201).json({ conversation });

    }catch (error) {
        console.error('Lỗi khi tạo cuộc trò chuyện:', error);
        res.status(500).json({ message: 'Lỗi hệ thống'});
    }
}
export const getConversations = async (req, res) => {
    try {
        const userId = req.user.id;
        const conversations = await Conversation.find({ 'participants.userId': userId }) 
            .sort({ lastMessageAt: -1, updatedAt: -1 })
            .populate('participants.userId', 'avatarUrl displayName')
            .populate('lastMessage.senderId', 'avatarUrl displayName')
            .populate('seenBy', 'avatarUrl displayName');
        const formattedConversations = conversations.map(conv => {
            const partacipants = conv.participants.map(p => ({
                _id: p.userId._id,

                displayName: p.userId?.displayName || "",
                avatarUrl: p.userId?.avatarUrl || "",
                joinedAt: p.joinedAt
            }));
            return {
                ...conv.toObject(),
                participants: partacipants,
                
            };
        });
        res.json({ conversations: formattedConversations });

    }catch(error) {
        console.error('Lỗi khi lấy danh sách cuộc trò chuyện:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
}
export const getMessages = async (req, res) => {
    try {
        const conversationId = req.params.conversationId;
        const {
            limit = 50,
            cursor
        } = req.query;
        const query = {};
        if (cursor) {
            query.createdAt = { $lt: new Date(cursor) };
        } 

        const messages = await Message.find({ conversationId, ...query }).sort({ createdAt: -1 }).limit(Number(limit) + 1);
        let nextCursor = null;
        if(messages.length > limit) {
            nextCursor = messages[messages.length - 1].createdAt;
            messages.pop();
        }
        res.json({ messages, nextCursor });

    }catch (error) {
        console.error('Lỗi khi lấy tin nhắn:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
}