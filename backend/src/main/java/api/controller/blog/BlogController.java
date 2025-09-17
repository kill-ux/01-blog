package api.controller.blog;

import api.model.blog.Blog;
import api.model.blog.BlogRequest;
import api.model.blog.BlogResponse;
import api.service.BlogService;
import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/blogs")
public class BlogController {

    private final BlogService blogService;

    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @GetMapping
    public ResponseEntity<List<BlogResponse>> getBlogs(@RequestParam(defaultValue = "0") int pageNumber) {
        List<BlogResponse> savedBlog = this.blogService.getBlogs(pageNumber);
        return ResponseEntity.ok(savedBlog);
    }

    @PostMapping("/store")
    public ResponseEntity<BlogResponse> saveBlog(@Valid @RequestBody BlogRequest blogRequest) {
        BlogResponse savedBlog = this.blogService.saveBlog(blogRequest);
        return ResponseEntity.ok(savedBlog);
    }

    @GetMapping("{blogId}")
    public ResponseEntity<BlogResponse> getBlog(
            @PathVariable long blogId) {
        BlogResponse savedBlog = this.blogService.getBlog(blogId);
        return ResponseEntity.ok(savedBlog);
    }

    @GetMapping("{blogId}/children")
    public ResponseEntity<List<BlogResponse>> getBlogChildren(
            @RequestParam(defaultValue = "0") int pageNumber,
            @PathVariable long blogId) {
        List<BlogResponse> savedBlog = this.blogService.getBlogChildren(blogId, pageNumber);
        return ResponseEntity.ok(savedBlog);
    }

    @PostMapping("{blogId}/update")
    public ResponseEntity<BlogResponse> updateBlog(
            @Valid @RequestBody BlogRequest blogRequest,
            @PathVariable long blogId) {
        BlogResponse savedBlog = this.blogService.updateBlog(blogRequest, blogId);
        return ResponseEntity.ok(savedBlog);
    }

}
