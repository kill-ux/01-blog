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
    children: BlogResponce[],
    hidden: boolean
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
    notfs: Notification[],
    count: number
}


export interface Report {
    id: number,
    reason: string,
    status: boolean,
    createdAt: string,
    updatedAt: string,
    blogId: number,
    reportingUser: User,
    reportedUser: User
}