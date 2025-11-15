package api.model.blog;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import api.model.like.Like;
import api.model.notification.Notification;
import api.model.user.User;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "blogs")
@Getter
@Setter
public class Blog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false, length = 5000)
    private String description;

    private String title;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    @OneToMany(mappedBy = "parent")
    private List<Blog> blogs = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Blog parent;

    private boolean hidden;

    @Column(nullable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    
    // @OnDelete(action = OnDeleteAction.CASCADE)
    // @JoinTable(name = "likes",
    //         // CORRECT: joinColumns points to the current entity (Blog)
    //         joinColumns = @JoinColumn(name = "blog_id"),
    //         // CORRECT: inverseJoinColumns points to the target entity (User)
    //         inverseJoinColumns = @JoinColumn(name = "user_id"))
    // likes
    @OneToMany(mappedBy = "blog")
    private List<Like> Likes = new ArrayList<>();

    @OneToMany(mappedBy = "blog")
    private List<Notification> notifications;
}
