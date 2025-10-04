package api.model.blog;

import java.time.LocalDateTime;

import api.model.user.User;
import api.model.user.UserResponse;
import lombok.Data;

@Data
public class BlogResponse {
    private Long id;
    private String description;
    private String title;
    private UserResponse user;
    private boolean hidden;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private BlogResponse parent;
    private int likes;
    private boolean isLike;

    public BlogResponse(Blog blog, long idd) {
        this.id = blog.getId();
        this.description = blog.getDescription();
        this.title = blog.getTitle();
        this.user = new UserResponse(blog.getUser());
        this.hidden = blog.isHidden();
        this.createdAt = blog.getCreatedAt();
        this.updatedAt = blog.getUpdatedAt();
        this.likes = blog.getLikedBy().size();
        for (User user : blog.getLikedBy()) {
            if (user.getId() == idd) {
                this.isLike = true;
                break;
            }
        }

        if (blog.getParent() != null) {
            this.parent = new BlogResponse(blog.getParent(), true, idd);
        }
    }

    public BlogResponse(Blog blog, boolean parent, long idd) {
        this.id = blog.getId();
        this.description = blog.getDescription();
        this.title = blog.getTitle();
        this.user = new UserResponse(blog.getUser());
        this.hidden = blog.isHidden();
        this.createdAt = blog.getCreatedAt();
        this.updatedAt = blog.getUpdatedAt();
        for (User user : blog.getLikedBy()) {
            if (user.getId() == idd) {
                this.isLike = true;
                break;
            }
        }
    }
}
