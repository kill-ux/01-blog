package api.model.user;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Future;

public class UserRequests {
    public record UserId(long userId) {
    }

    public record BanRequest(long userId,
            @Future(message = "must be a future date") LocalDateTime until) {
    }
}