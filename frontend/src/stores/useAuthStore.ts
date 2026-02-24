import  {create}  from 'zustand';
import { authService } from '@/services/auth.service';
import type { User } from '@/Types/user.type';
import { toast } from 'sonner';
import type { AuthStore } from '@/Types/useAuthStore.type';


export const useAuthStore =create<AuthStore>((set, get) => {
    return {
        accessToken: null,
        user: null,
        loading: false,
        setAccessToken: (token: string | null) => set({ accessToken: token }),
        clearStore: () => set({ user: null, accessToken: null }),
        signUp: async ({firstname,lastname,username,email,password}:User) => {
            try {
                set({ loading: true });
              await authService.signUp({firstname,lastname,username,email,password});
                
                toast.success('Đăng ký thành công!');
               
            }catch (error) {
                console.log(error);
                toast.error('Đăng ký thất bại. Vui lòng thử lại.');
            } finally {
                set({loading:false});
            }
        },
        signIn:async (username,password) => {
            try {
                set({ loading: true });
                const res = await authService.signIn({ username, password });
                set({ user: res.user, accessToken: res.accessToken });
                toast.success('Đăng nhập thành công!');
            }catch (error) {
                console.log(error);
                toast.error('Đăng nhập thất bại. Vui lòng thử lại.');
            } finally {
                set({loading:false});
            }
        },
        signOut:async () => {
            try {
                await authService.signOut();
                get().clearStore();
                toast.success('Đăng xuất thành công!');
            } catch (error) {
                console.log(error);
                toast.error('Đăng xuất thất bại. Vui lòng thử lại.');
            }
        },
        fetchMe: async () => {
            try {
                set({ loading: true });
                const res = await authService.fetchMe();
                set({ user: res.user });
               
            }catch (error) {
                console.log(error);
               
            }finally{
                set({loading:false})
            }
        },
        refresh: async () => {
            try {
                set({ loading: true });
                const res = await authService.refresh();
                set({ accessToken: res.accessToken });
                if (!get().user) {
                    get().fetchMe();
                }
            }catch (error) {
                console.log(error);
                toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
                get().clearStore();
                window.location.href = '/signin';
             
            }finally{
                set({loading:false})
            }
        }
    }
})