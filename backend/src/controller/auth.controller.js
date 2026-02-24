import { User } from '../models/User.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Session } from '../models/Session.model.js';

const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL = 1000 * 60 * 60 * 24 * 7;
//[post] /api/auth/signup
export const signup = async (req, res) => {
    try {
        const { username, password, email, firstname, lastname } = req.body;
        if (!username || !password || !email || !firstname || !lastname) {
            return res.status(400).json({
                oke: false,
                message:
                    'Không được thiếu thông tin username,password,emai,firstname,lastname'
            });
        }
        const existsUser = await User.findOne({ username: username });
        if (existsUser) {
            return res.status(409).json({
                oke: false,
                message: 'Người dùng đã tồn tại. Vui lòng đặt username khác'
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            hashedPassword,
            email,
            displayName: `${firstname} ${lastname}`,
            ...req.body
        });
        await user.save();
        return res
            .status(201)
            .json({ ok: true, message: 'Đăng ký thành công' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ oke: false, message: 'Lỗi khi signup' });
    }
};

//[POST] /api/auth/signin
export const signin = async (req, res) => {
    try {
        const { username, password } = req.body;
        //check có thiếu dữ liệu không?
        if (!username || !password) {
            return res
                .status(400)
                .json({ oke: false, message: 'Thiếu username hoặc password' });
        }
        //kiểm tra username
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(401).json({
                oke: false,
                message: 'username hoặc password không đúng'
            });
        }
        //check password
        const passwordMatch = await bcrypt.compare(
            password,
            user.hashedPassword
        );
        if (!passwordMatch) {
            return res.status(401).json({
                oke: false,
                message: 'username hoặc password không đúng'
            });
        }
        //tạo accessToken
        const accessToken = jwt.sign(
            { userId: user.id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: ACCESS_TOKEN_TTL }
        );
        //tạo refreshToken
        const refreshToken = crypto.randomBytes(64).toString('hex');
        await new Session({
            userId: user.id,
            refreshToken: refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL)
        }).save();
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: REFRESH_TOKEN_TTL
        });
        return res.status(200).json({
            oke: true,
            message: `User ${user.displayName} đã logged in`,
            accessToken,
            user: {
                id: user.id,
                username: user.username,
                displayName: user.displayName,
                email: user.email
            }
        });
    } catch (error) {
        return res.status(500).json({ oke: false, message: 'Lỗi khi sigin' });
    }
};

//[GET] /api/auth/signout
export const signout = async (req, res) => {
    try {
        //lấy refreshToken
        const refreshToken = req.cookies?.refreshToken;
        if (refreshToken) {
            //xóa db
            await Session.deleteOne({ refreshToken: refreshToken });
            //xóa cookie
            res.clearCookie('refreshToken');
            return res.status(204);
        }
    } catch (error) {
        return res
            .status(500)
            .json({ ok: false, message: 'Lỗi khi sign out', error });
    }
};

//GET /api/auth/refresh
export const refresh = async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    try {
        if (!refreshToken) {
            return res
                .status(401)
                .json({ ok: false, message: 'No refresh token' });
        }
        const session = await Session.findOne({ refreshToken: refreshToken });
        if (!session) {
            return res
                .status(403)
                .json({ ok: false, message: 'Invalid refresh token' });
        }
        const newAccessToken = jwt.sign(
            { userId: session.userId },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: ACCESS_TOKEN_TTL }
        );
        return res
            .status(200)
            .json({ ok: true, accessToken: newAccessToken });
    } catch (error) {
        return res.status(500).json({ ok: false, message: 'Lỗi khi refresh token' });
    }
}