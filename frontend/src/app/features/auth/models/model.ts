interface user {
    id: number;
    nickname: string;
    email: string;
    role: string;
    avatar: string;
    bannedUntil: string | null;
    birthDate: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: user | null;
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