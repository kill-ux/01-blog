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

/**
 * Controller for handling blog-related operations.
 * Provides endpoints for creating, retrieving, updating, deleting, and interacting with blogs.
 */
@RestController
@RequestMapping("/api/blogs")
@RateLimiter(name = "myApiLimiter")
public class BlogController {

    private final BlogService blogService;

    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    /**
     * Retrieves a list of all blogs, intended for admin use.
     * @param cursor The pagination cursor.
     * @return A list of blogs.
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BlogResponse>> getBlogs(@RequestParam(defaultValue = "0") long cursor) {
        List<BlogResponse> savedBlog = this.blogService.getBlogs(cursor);
        return ResponseEntity.ok(savedBlog);
    }

    /**
     * Retrieves the total count of all blogs, intended for admin use.
     * @return A map containing the total blog count.
     */
    @GetMapping("/count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> getBlogsCount() {
        return ResponseEntity.ok(Map.of("count", this.blogService.getBlogsCount()));
    }

    /**
     * Retrieves blogs from the user's network.
     * @param cursor The pagination cursor.
     * @return A list of blogs from the user's network.
     */
    @GetMapping("/networks")
    public ResponseEntity<List<BlogResponse>> getBlogsNetworks(@RequestParam(defaultValue = "0") long cursor) {
        List<BlogResponse> savedBlog = this.blogService.getBlogsNetworks(cursor);
        return ResponseEntity.ok(savedBlog);
    }

    /**
     * Saves a new blog post.
     * @param blogRequest The request body containing blog details.
     * @return The saved blog post.
     */
    @PostMapping("/store")
    public ResponseEntity<BlogResponse> saveBlog(@Valid @RequestBody BlogRequest blogRequest) {
        BlogResponse savedBlog = this.blogService.saveBlog(blogRequest);
        return ResponseEntity.ok(savedBlog);
    }

    /**
     * Retrieves a single blog post by its ID.
     * Access is restricted to admins or if the blog is not hidden.
     * @param blogId The ID of the blog to retrieve.
     * @return The requested blog post.
     */
    @GetMapping("{blogId}")
    @PreAuthorize("hasRole('ADMIN') or @blogService.getBlog(#blogId).isHidden == false")
    public ResponseEntity<BlogResponse> getBlog(
            @PathVariable long blogId) {
        BlogResponse savedBlog = this.blogService.getBlog(blogId);
        return ResponseEntity.ok(savedBlog);
    }

    /**
     * Retrieves the children (comments) of a blog post.
     * @param cursor The pagination cursor.
     * @param blogId The ID of the parent blog.
     * @return A response containing the children of the blog.
     */
    @GetMapping("{blogId}/children")
    public ResponseEntity<ChildrenResponse> getBlogChildren(
            @RequestParam(defaultValue = "0") long cursor,
            @PathVariable long blogId) {
        ChildrenResponse savedBlog = this.blogService.getBlogChildren(blogId, cursor);
        return ResponseEntity.ok(savedBlog);
    }

    /**
     * Updates an existing blog post.
     * Only the author of the blog can perform this action.
     * @param blogRequest The request body containing updated blog details.
     * @param blogId The ID of the blog to update.
     * @return The updated blog post.
     */
    @PutMapping("{blogId}/update")
    @PreAuthorize("@blogService.getBlog(#blogId).user.id == authentication.principal.id")
    public ResponseEntity<BlogResponse> updateBlog(
            @Valid @RequestBody BlogRequest blogRequest,
            @PathVariable long blogId) {
        BlogResponse savedBlog = this.blogService.updateBlog(blogRequest, blogId);
        return ResponseEntity.ok(savedBlog);
    }

    /**
     * Hides a blog post, intended for admin use.
     * @param blogId The ID of the blog to hide.
     * @return A map indicating the new hidden status of the blog.
     */
    @PatchMapping("{blogId}/hide")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Boolean>> hideBlog(@PathVariable long blogId) {
        return ResponseEntity.ok(Map.of("hide", this.blogService.hideBlog(blogId)));
    }

    /**
     * Deletes a blog post.
     * Can be performed by an admin or the author of the blog.
     * @param blogId The ID of the blog to delete.
     * @return A success message upon deletion.
     */
    @DeleteMapping("{blogId}/delete")
    @PreAuthorize("hasRole('ADMIN') or @blogService.getBlog(#blogId).user.id == authentication.principal.id")
    public ResponseEntity<String> deleteBlog(@PathVariable long blogId) {
        this.blogService.deleteBlog(blogId);
        return ResponseEntity.ok("success deleted of BLOG");
    }

    /**
     * Toggles a 'like' on a blog post.
     * @param blogId The ID of the blog to like or unlike.
     * @return A map containing the change in the number of likes (1 for like, -1 for unlike).
     */
    @PostMapping("{blogId}/like")
    public ResponseEntity<Map<String, Integer>> likeBlog(@PathVariable long blogId) {
        return ResponseEntity.ok(this.blogService.likeBlog(blogId));
    }

    /**
     * Retrieves the total number of likes for a blog post.
     * @param blogId The ID of the blog.
     * @return A map containing the total number of likes.
     */
    @GetMapping("{blogId}/likes")
    public ResponseEntity<Map<String, Integer>> getLikes(@PathVariable long blogId) {
        return ResponseEntity.ok(this.blogService.getLikes(blogId));
    }

}
