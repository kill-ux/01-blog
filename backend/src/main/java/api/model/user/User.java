package api.model.user;

import java.time.LocalDateTime;
import java.util.*;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import api.model.blog.Blog;
import api.model.notification.Notification;
import api.model.report.Report;
import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Entity
// @Data
@Getter
@Setter
@Table(name = "users")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Pattern(regexp = "^[a-zA-Z0-9_-]+$")
    @Column(nullable = false, unique = true)
    private String nickname;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role;

    private String avatar;
    private boolean bannedUntil;

    private LocalDateTime birthDate;

    @Column(nullable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Override
    public String getUsername() {
        return this.nickname;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role));
    }

    @Override
    public boolean isAccountNonLocked() {
        return !bannedUntil;
    }


    @OneToMany(mappedBy = "user")
    private List<Blog> blogs = new ArrayList<>();

    @ManyToMany
    private Set<User> subscribers = new HashSet<>();

    @OnDelete(action = OnDeleteAction.CASCADE)
    @ManyToMany(mappedBy = "subscribers")
    private Set<User> subscribed_to = new HashSet<>();

    @OnDelete(action = OnDeleteAction.CASCADE)
    @ManyToMany(mappedBy = "likedBy")
    private List<Blog> likedBlogs = new ArrayList<>();

    @OneToMany(mappedBy = "reportingUser")
    private List<Report> submittedReports = new ArrayList<>();

    @OneToMany(mappedBy = "reportedUser" )
    private List<Report> reportsAboutMe = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<Notification> notifications;
}


