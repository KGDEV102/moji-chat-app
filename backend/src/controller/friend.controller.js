import { Friend } from '../models/friend.model.js';
import FriendRequest from '../models/FriendRequest.js';
import { User } from '../models/User.model.js';
export const addFriend = async (req, res) => {
    try {
        const { toUserId, message } = req.body;
        const fromUserId = req.user._id;
        if (!User.findById(toUserId)) {
            return res
                .status(404)
                .json({ message: 'Người dùng không tồn tại' });
        }
        let userA = fromUserId.toString();
        let userB = toUserId.toString();
        if (userA > userB) {
            [userA, userB] = [userB, userA];
        }
        const [existsingFriend, existingRequest] = await Promise.all([
            Friend.findOne({ userA, userB }),
            FriendRequest.find({
                $or: [
                    { from: fromUserId, to: toUserId },
                    { from: toUserId, to: fromUserId }
                ]
            })
        ]);
        if (existsingFriend) {
            return res.status(400).json({ message: 'Hai người đã là bạn bè' });
        }
        if (existingRequest) {
            return res
                .status(400)
                .json({ message: 'Đã tồn tại lời mời kết bạn' });
        }

        const friendRequest = new FriendRequest({
            from: fromUserId,
            to: toUserId,
            messaage: message
        });
        await friendRequest.save();
        res.status(200).json({
            message: 'Gửi lời mời kết bạn thành công',
            friendRequest
        });
    } catch (error) {
        console.log('Lỗi khi thêm bạn bè:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};
export const acceptFriendRequest = async (req, res) => {
    try {
        const requestId = req.params.requestId;
        const userId = req.user._id;
        const friendRequest = await FriendRequest.findById(requestId);
        if (!friendRequest) {
            return res.status(404).json({ message: 'Lời mời kết bạn không tồn tại' });
        }
        if (friendRequest.to.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Bạn không thể chấp nhận lời mời kết bạn này' });
        }
        const { from, to } = friendRequest;
        const newFriend = new Friend({
            userA: from,
            userB: to
        });
        await newFriend.save();
        await FriendRequest.findByIdAndDelete(requestId);
        const Sender = await User.findById(from).select(
            '_id displayName avatarUrl'
        ).lean();
        res.status(200).json({
            message: 'Chấp nhận lời mời kết bạn thành công', newFriend: {
                _id: newFriend._id,
                displayName: Sender.displayName,
                avatarUrl: Sender.avatarUrl
        } });
    } catch (error) {
        console.log('Lỗi khi chấp nhận lời mời kết bạn:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};
export const declineFriendRequest = async (req, res) => {
    try {
        const requestId = req.params.requestId;
        const userId = req.user._id;
        const friendRequest = await FriendRequest.findById(requestId);
        if (!friendRequest) {
            return res.status(404).json({ message: 'Lời mời kết bạn không tồn tại' });
        }
        if (friendRequest.to.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Bạn không thể từ chối lời mời kết bạn này' });
        }
        await FriendRequest.findByIdAndDelete(requestId);
        res.status(200).json({ message: 'Từ chối lời mời kết bạn thành công' });
    } catch (error) {
        console.log('Lỗi khi hủy lời mời kết bạn:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};
export const getAllFriends = async (req, res) => {
    try {
        const userId = req.user._id;
        const friends = await Friend.find({
            $or: [{ userA: userId }, { userB: userId }]
        }).populate("userA userB", "_id displayName avatarUrl").lean();
        const friendList = friends.map(friend => {
            const friendInfo = friend.userA._id.toString() === userId.toString() ? friend.userB : friend.userA;
            return friendInfo;
        });
        res.status(200).json({ friends: friendList });

    } catch (error) {
        console.log('Lỗi khi lấy danh sách bạn bè:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};
export const getFriendRequests = async (req, res) => {
    try {
        const userId = req.user._id;
       const [sent, received] = await Promise.all([
            FriendRequest.find({ from: userId }).populate('to', '_id displayName avatarUrl').lean(),
            FriendRequest.find({ to: userId }).populate('from', '_id displayName avatarUrl').lean()
        ]);
      
        res.status(200).json({ sent, received });
    } catch (error) {
        console.log('Lỗi khi lấy danh sách lời mời kết bạn:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};
