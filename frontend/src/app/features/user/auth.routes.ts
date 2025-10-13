import { Routes } from "@angular/router";
import { Profile } from "./profile/profile";

export const UsersRoutes: Routes = [

    {
        path: 'profile/:id',
        component: Profile,
        pathMatch: 'full'
    },
    {
        path: '',
    },
]