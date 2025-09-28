import { Routes } from "@angular/router";
import { Users } from "./users/users";
import { Profile } from "./profile/profile";

export const UsersRoutes: Routes = [

    {
        path: 'profile',
        component: Profile,
        pathMatch: 'full'
    },
    {
        path: '',
        component: Users
    },
]