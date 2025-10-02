import { Routes } from "@angular/router";
import { CreateBlog } from "./pages/create-blog/create-blog";
import { Blogs } from "./pages/blogs/blogs";

export const BlogsRoutes: Routes = [
    {
        path: '',
        component : Blogs
    },
    {
        path: 'create',
        component : CreateBlog
    }
]