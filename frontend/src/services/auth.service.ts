import api from '@/api/axios';
import type { User } from '@/Types/user.type';

export const authService = {
    signUp: async (data: User) => {
        const res = await api.post('/auth/signup', data);
        return res.data;
    },
    signIn: async ({
        username,
        password
    }: {
        username: string;
        password: string;
    }) => {
        const res = await api.post('/auth/signin', { username, password });
        return res.data;
    },
    signOut: async () => {
        const res = await api.get('/auth/signout');
        return res.data;
    },
    fetchMe: async () => {
        const res = await api.get('/user');
        return res.data;
    },
    refresh: async () => {
        const res = await api.get('/auth/refresh');
        return res.data;
    },
    profile:async () => {
        const res = await api.get('/user/profile');
        return res.data;
    }
};
