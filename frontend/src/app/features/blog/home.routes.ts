import { Routes } from "@angular/router";
import { CreateBlog } from "./pages/create-blog/create-blog";
import { Blogs } from "./pages/blogs/blogs";
import { SingleBlog } from "./pages/single-blog/single-blog";

export const BlogsRoutes: Routes = [
    {
        path: '',
        component : Blogs
    },
    {
        path: 'create',
        component : CreateBlog
    },
    {
        path: 'blog/:id',
        component : SingleBlog,
    }
]