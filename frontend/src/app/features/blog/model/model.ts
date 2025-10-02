import { User } from "../../auth/models/model";

export interface BlogRequest {
    description: string;
    parent: number
}

export interface BlogResponce {
    id: number;
    description: string;
    parent: BlogResponce
    user: User
    createdAt: Date;
    updatedAt: Date;
}