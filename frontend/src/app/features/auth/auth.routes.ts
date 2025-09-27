import { Routes } from "@angular/router";
import { Signin } from "./signin/signin";
import { Signup } from "./signup/signup";

export const authRoutes: Routes = [
    {
        path: 'signin',
        component: Signin
    },
    {
        path: 'signup',
        component: Signup
    },
    {
        path: '',
        redirectTo: 'signin',
        pathMatch: 'full'
    },
]