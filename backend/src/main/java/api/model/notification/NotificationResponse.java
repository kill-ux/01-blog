package api.model.notification;

import java.time.LocalDateTime;

import api.model.blog.Blog;
import api.model.user.UserResponse;
import lombok.Data;

@Data
public class NotificationResponse {
    private Long id;
    private UserResponse sender;
    private Long postId;
    private boolean read;
    private LocalDateTime createdAt;

    public NotificationResponse(Notification ntf) {
        Blog blog = ntf.getBlog();
        this.id = ntf.getId();
        this.postId = blog.getId();
        this.read = ntf.isRead();
        this.createdAt = ntf.getCreatedAt();
        this.sender = new UserResponse(blog.getUser());
    }
}