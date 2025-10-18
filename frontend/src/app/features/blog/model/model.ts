import { User } from "../../auth/models/model";

export interface BlogRequest {
    title: string;
    description: string;
    parent: number
}

export interface BlogResponce {
    id: number;
    title: string;
    description: string;
    parent: BlogResponce
    user: User
    createdAt: Date;
    updatedAt: Date;
    likes: number
    like: boolean
    childrenCount: number
    isCopied: boolean
    children: BlogResponce[]
}

export interface Notification {
    id: number;
    read: boolean;
    postId: number
    sender: User
    createdAt: Date;
    updatedAt: Date;
}

export interface NotificationResponce {
    notfs: NotificationResponce[],
    count: number
}
