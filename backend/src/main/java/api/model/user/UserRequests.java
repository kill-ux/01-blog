package api.model.user;

import java.time.LocalDateTime;

public class UserRequests {
    public record UserId(long userId) {
    }

    public record BanRequest(long userId, LocalDateTime until) {
    }
}