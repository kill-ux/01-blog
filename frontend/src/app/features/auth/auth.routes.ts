import { Routes } from "@angular/router";
import { Signin } from "./signin/signin";
import { Signup } from "./signup/signup";
import { NotFound } from "../../errors/not-found/not-found";
import { Internal } from "../../errors/internal/internal";

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
    {
        path: '**',
        component: NotFound
    },
]