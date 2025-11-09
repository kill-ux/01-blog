package api.controller.blog;

import api.model.blog.BlogRequest;
import api.model.blog.BlogResponse;
import api.model.blog.ChildrenResponse;
import api.service.BlogService;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/blogs")
@RateLimiter(name = "myApiLimiter")
public class BlogController {

    private final BlogService blogService;

    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BlogResponse>> getBlogs(@RequestParam(defaultValue = "0") long cursor) {
        List<BlogResponse> savedBlog = this.blogService.getBlogs(cursor);
        return ResponseEntity.ok(savedBlog);
    }

    @GetMapping("/count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> getBlogsCount() {
        return ResponseEntity.ok(Map.of("count", this.blogService.getBlogsCount()));
    }

    @GetMapping("/networks")
    public ResponseEntity<List<BlogResponse>> getBlogsNetworks(@RequestParam(defaultValue = "0") long cursor) {
        List<BlogResponse> savedBlog = this.blogService.getBlogsNetworks(cursor);
        return ResponseEntity.ok(savedBlog);
    }

    @PostMapping("/store")
    public ResponseEntity<BlogResponse> saveBlog(@Valid @RequestBody BlogRequest blogRequest) {
        BlogResponse savedBlog = this.blogService.saveBlog(blogRequest);
        return ResponseEntity.ok(savedBlog);
    }

    @GetMapping("{blogId}")
    @PreAuthorize("hasRole('ADMIN') or @blogService.getBlog(#blogId).isHidden == false")
    public ResponseEntity<BlogResponse> getBlog(
            @PathVariable long blogId) {
        BlogResponse savedBlog = this.blogService.getBlog(blogId);
        return ResponseEntity.ok(savedBlog);
    }

    @GetMapping("{blogId}/children")
    public ResponseEntity<ChildrenResponse> getBlogChildren(
            @RequestParam(defaultValue = "0") long cursor,
            @PathVariable long blogId) {
        ChildrenResponse savedBlog = this.blogService.getBlogChildren(blogId, cursor);
        return ResponseEntity.ok(savedBlog);
    }

    @PutMapping("{blogId}/update")
    @PreAuthorize("@blogService.getBlog(#blogId).user.id == authentication.principal.id")
    public ResponseEntity<BlogResponse> updateBlog(
            @Valid @RequestBody BlogRequest blogRequest,
            @PathVariable long blogId) {
        BlogResponse savedBlog = this.blogService.updateBlog(blogRequest, blogId);
        return ResponseEntity.ok(savedBlog);
    }

    @PatchMapping("{blogId}/hide")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Boolean>> hideBlog(@PathVariable long blogId) {
        return ResponseEntity.ok(Map.of("hide", this.blogService.hideBlog(blogId)));
    }

    @DeleteMapping("{blogId}/delete")
    @PreAuthorize("hasRole('ADMIN') or @blogService.getBlog(#blogId).user.id == authentication.principal.id")
    public ResponseEntity<String> deleteBlog(@PathVariable long blogId) {
        this.blogService.deleteBlog(blogId);
        return ResponseEntity.ok("success deleted of BLOG");
    }

    @PostMapping("{blogId}/like")
    public ResponseEntity<Map<String, Integer>> likeBlog(@PathVariable long blogId) {
        return ResponseEntity.ok(this.blogService.likeBlog(blogId));
    }

    @GetMapping("{blogId}/likes")
    public ResponseEntity<Map<String, Integer>> getLikes(@PathVariable long blogId) {
        return ResponseEntity.ok(this.blogService.getLikes(blogId));
    }

}
