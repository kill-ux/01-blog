package api.model.notification;

import java.time.LocalDateTime;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import api.model.blog.Blog;
import api.model.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private boolean read;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Blog blog;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;

    public String getRecipient(){
        return user.getNickname();
    }
}
