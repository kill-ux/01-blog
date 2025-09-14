package api.model.user;

import java.time.LocalDateTime;
import java.util.*;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;

import api.model.blog.Blog;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Data
@Table(name = "users")
@EqualsAndHashCode(exclude = {"subscribers", "subscribed_to"}) // Also exclude from equals and hashCode
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false, unique = true)
    private String nickname;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role;

    private String avatar;
    private LocalDateTime bannedUntil;

    // @Past(message = "Birth date must be in the past")
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
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Blog> blogs = new ArrayList<>();

    @ManyToMany
    @JoinTable(
        name = "subscription", 
        joinColumns = @JoinColumn(name = "subscriber_to_id"), 
        inverseJoinColumns = @JoinColumn(name = "subscriber_id"), 
        uniqueConstraints = @UniqueConstraint(columnNames = {"subscriber_id", "subscriber_to_id" }))
    @JsonIgnore
    private Set<User> subscribers = new HashSet<>();;

    @ManyToMany(mappedBy = "subscribers", fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<User> subscribed_to = new HashSet<>();;
}
