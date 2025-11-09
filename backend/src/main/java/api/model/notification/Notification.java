package api.model.notification;

import java.time.LocalDateTime;

import api.model.blog.Blog;
import api.model.user.User;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private boolean read;

    @ManyToOne
    private User user;

    @ManyToOne
    private Blog blog;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;

    public String getRecipient(){
        return user.getNickname();
    }
}
