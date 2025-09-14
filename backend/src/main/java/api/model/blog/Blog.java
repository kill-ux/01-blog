package api.model.blog;

import java.time.LocalDateTime;
import java.util.Set;

import org.springframework.data.annotation.Reference;

import api.model.user.User;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "blogs")
@Data
public class Blog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    // @OneToMany()
    // @Column(nullable = false)
    // private long userId;

    private long parent;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private boolean hidden;
    private String media_url;
    private String media_type;

    @ManyToOne
    @JoinColumn(name = "user_id" , nullable = false)
    private User user;
}
