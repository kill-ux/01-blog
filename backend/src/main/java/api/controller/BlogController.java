package api.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import api.model.blog.Blog;
import api.model.blog.BlogRequest;
import api.service.BlogService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/blogs")
public class BlogController {

    private final BlogService blogService;

    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @PostMapping("/store")
    public ResponseEntity<Blog> postMethodName(@RequestBody BlogRequest blogRequest) {
        Blog savedBlog = this.blogService.saveBlog(blogRequest);
        return ResponseEntity.ok(savedBlog);
    }
    
}
