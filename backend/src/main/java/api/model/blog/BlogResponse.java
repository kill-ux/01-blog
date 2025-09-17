package api.model.blog;

import java.time.LocalDateTime;

import api.model.user.UserResponse;
import lombok.Data;

@Data
public class BlogResponse {
    private Long id;
    private String description;
    private String mediaUrl;
    private String mediaType;
    private UserResponse user;
    private boolean hidden;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private BlogResponse parent;

    public BlogResponse(Blog blog, Long parent) {
        this.id = blog.getId();
        this.description = blog.getDescription();
        this.mediaUrl = blog.getMediaUrl();
        this.mediaType = blog.getMediaType();
        this.user = new UserResponse(blog.getUser());
        this.hidden = blog.isHidden();
        this.createdAt = blog.getCreatedAt();
        this.updatedAt = blog.getUpdatedAt();
        if (parent != null && blog.getParent() != null) {
            this.parent = new BlogResponse(blog.getParent(), null);
        }
    }

    public BlogResponse(Blog blog) {
        this.id = blog.getId();
        this.description = blog.getDescription();
        this.mediaUrl = blog.getMediaUrl();
        this.mediaType = blog.getMediaType();
        this.user = new UserResponse(blog.getUser());
        this.hidden = blog.isHidden();
        this.createdAt = blog.getCreatedAt();
        this.updatedAt = blog.getUpdatedAt();
    }
}