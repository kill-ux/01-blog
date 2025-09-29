import { Routes } from "@angular/router";
import { Home } from "./home";
import { BlogHome } from "../blog/pages/blog-home/blog-home";

export const homeRoutes: Routes = [
    {
        path: '',
        component: Home
    },
    {
        path: 'feeds',
        component: BlogHome
    },
    // {
    //     path: 'blogs',
    // }
]