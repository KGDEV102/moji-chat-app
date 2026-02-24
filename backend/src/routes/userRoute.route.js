import express from 'express';
export const userRoute = express.Router();
import { user } from '../controller/user.controller.js';
import { profile } from '../controller/user.controller.js';

userRoute.get('/', user);
userRoute.get('/profile', profile);
