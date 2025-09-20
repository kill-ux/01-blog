package api.model.report;

import java.time.LocalDateTime;

import api.model.blog.Blog;
import api.model.user.User;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(nullable = false)
    private String reason;
    private boolean status;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;

    @ManyToOne
    private Blog blog;

    @ManyToOne
    @JoinColumn(name = "reporter_id")
    private User reportingUser;

    @ManyToOne
    @JoinColumn(name = "reported_user_id")
    private User reportedUser;
}

