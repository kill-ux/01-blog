package api.model.report;

import java.time.LocalDateTime;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import api.model.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(nullable = false, length = 1000)
    private String reason;
    private boolean status;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "reporter_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User reportingUser;

    @ManyToOne
    @JoinColumn(name = "reported_user_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User reportedUser;

    private Long blogId;
}


