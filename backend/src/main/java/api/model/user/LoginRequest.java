package api.model.user;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "Username is required") String nickname,
        @NotBlank(message = "Password is required") String password) {
}