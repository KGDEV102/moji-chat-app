import type { User } from '@/Types/user.type';
export interface AuthStore {
    user: User | null;
    loading: boolean;
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
    clearStore: () => void;
    signUp: ({ firstname, lastname, username, email, password}: User) => Promise<void>;
    signIn: (username: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    fetchMe: () => Promise<void>;
    refresh: () => Promise<void>;
}