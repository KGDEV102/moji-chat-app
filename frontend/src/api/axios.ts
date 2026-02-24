import axios from 'axios';
import { useAuthStore } from '@/stores/useAuthStore';
import { authService } from '@/services/auth.service';
const api = axios.create({
    baseURL:
        import.meta.env.MODE === 'development'
            ? 'http://localhost:8080/api'
            : '/api',
    withCredentials: true
});

// Add token to request header
api.interceptors.request.use(config => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});
api.interceptors.response.use(response => response, async error => { 
    const originalRequest = error.config;
    //những api ko cần check 
    if(originalRequest.url.includes('/signin') || originalRequest.url.includes('/signup') || originalRequest.url.includes('/signout')){
        return Promise.reject(error);
    }
    originalRequest._retry = originalRequest._retry || 0;
    if (error.response.status === 403 && originalRequest._retry <4) {
        originalRequest._retry += 1;
        try {
            const res = await authService.refresh();
            const accessToken = res.accessToken;
            useAuthStore.getState().setAccessToken(accessToken);
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
            return api(originalRequest);
           
        } catch (error) {
            useAuthStore.getState().clearStore();
            return Promise.reject(error);
        }
    }
    return Promise.reject(error);
});
export default api;
