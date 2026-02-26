import express from "express";
import dotenv from 'dotenv';
import { connect } from "./libs/db.js";
import { authRoute } from './routes/authRoute.route.js';
import { userRoute } from './routes/userRoute.route.js';
import cookieParser from "cookie-parser";
import { authorization } from "./middleware/user.middleware.js";
import { friendRoute } from "./routes/friendRoute.route.js";    
import cors from "cors";
const app = express();
dotenv.config();
app.use(cookieParser());
//middleware
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
const PORT = process.env.PORT || 8080;
//public route 
app.use("/api/auth", authRoute);
//middleware
app.use(authorization);
//private route
app.use("/api/user", userRoute);
app.use("/api/friend", friendRoute);
connect().then(
    app.listen(PORT, () => {
        console.log(`listen port ${PORT}`);
    })
);
