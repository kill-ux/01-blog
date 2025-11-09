package api.model.user;

import jakarta.validation.constraints.NotNull;

public class UserRequests {
    public record UserId(@NotNull Long userId) {}
}