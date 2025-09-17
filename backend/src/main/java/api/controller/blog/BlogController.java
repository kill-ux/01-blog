package api.controller.blog;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import api.model.blog.Blog;
import api.model.blog.BlogRequest;
import api.model.blog.BlogResponse;
import api.service.BlogService;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
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
    public ResponseEntity<BlogResponse> saveBlog(@Valid @RequestBody BlogRequest blogRequest) {
        BlogResponse savedBlog = this.blogService.saveBlog(blogRequest);
        return ResponseEntity.ok(savedBlog);
    }

    @PostMapping("{blogId}/update")
    public ResponseEntity<BlogResponse> updateBlog(
            @Valid @RequestBody BlogRequest blogRequest,
            @PathVariable long blogId) {
        BlogResponse savedBlog = this.blogService.updateBlog(blogRequest,blogId);
        return ResponseEntity.ok(savedBlog);
    }

}
