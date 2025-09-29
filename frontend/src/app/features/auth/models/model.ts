export interface User {
    id: number;
    nickname: string;
    email: string;
    role: string;
    avatar: string | null;
    bannedUntil: string | null;
    birthDate: string | null;
    createdAt: string | null;
    updatedAt: string | null;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
}

export const initialAuthState: AuthState = {
    isAuthenticated: false,
    user: null
}

export interface SigninCredentials {
    nickname: string;
    password: string;
}

export interface SignupCredentials {
    nickname: string;
    email: string;
    password: string;
}