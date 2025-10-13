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
    sub: boolean
}

export interface AuthState {
    user: User | null;
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