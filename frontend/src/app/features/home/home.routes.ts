import { Routes } from "@angular/router";
import { Home } from "./home";
import { BlogHome } from "../blog/pages/blog-home/blog-home";
import { BlogsRoutes } from "../blog/home.routes";

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
    // {
    //     path: 'blogs',
    // }
]