package api.model.user;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class UserResponse {
    private long id;
    private String nickname;
    private String email;
    private String role;
    private String avatar;
    private LocalDateTime bannedUntil;
    private LocalDateTime birthDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructor, getters, and setters
    public UserResponse(User user) {
        this.id = user.getId();
        this.nickname = user.getNickname();
        this.email = user.getEmail();
        this.role = user.getRole();
        this.avatar = user.getAvatar();
        this.bannedUntil = user.getBannedUntil();
        this.birthDate = user.getBirthDate();
        this.createdAt = user.getCreatedAt();
        this.updatedAt = user.getUpdatedAt();
    }
}