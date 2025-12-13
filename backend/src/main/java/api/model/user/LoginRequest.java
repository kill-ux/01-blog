package api.model.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
        @NotBlank(message = "Username is required") @Size(max = 50) String nickname,
        @NotBlank(message = "Password is required") @Size(max = 100) String password) {
}