import jwt from 'jsonwebtoken';
import { User } from '../models/User.model.js';
export const authorization = async (req, res, next) => {
    try {
        //lấy accessToken
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ ok: false, message: 'No token' });
        }

        const token = authHeader.split(' ')[1];

        //check
        if (!token) {
            return res.status(401).json({ ok: false, message: 'No token' });
        }
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            async (error, decodedUser) => {
                if (error) {
                    return res
                        .status(403)
                        .json({ ok: false, message: 'Invalid token' });
                }
                const user = await User.findOne({
                    _id: decodedUser.userId
                }).select('-password');
                if (!user) {
                    return res
                        .status(404)
                        .json({ ok: false, message: 'user không tồn tại' });
                }
                req.user = user;
                next();
            }
        );
    } catch (error) {
        return res.status(500).json({ ok: false, message: 'Lỗi hệ thống' });
    }
};
