import { Routes } from "@angular/router";
import { Home } from "./home";
import { BlogHome } from "../blog/pages/blog-home/blog-home";
import { BlogsRoutes } from "../blog/home.routes";
import { Discover } from "../user/discover/discover";
import { Profile } from "../user/profile/profile";

export const homeRoutes: Routes = [
    // {
    //     path: '',
    //     component: Home
    // },
    {
        path: '',
        component: BlogHome,
        children: BlogsRoutes
    },
    {
        path: 'discover',
        component: Discover,
    },
    {
        path: 'profile/:id',
        component: Profile,
        pathMatch: 'full'
    },
    // {
    //     path: 'blogs',
    // }
]