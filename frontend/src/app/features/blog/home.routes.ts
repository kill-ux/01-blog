import { Routes } from "@angular/router";
import { CreateBlog } from "./pages/create-blog/create-blog";

export const BlogsRoutes: Routes = [
    {
        path: 'create',
        component : CreateBlog
    }
]