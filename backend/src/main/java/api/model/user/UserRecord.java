package api.model.user;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record UserRecord(
		long id,
		@NotBlank(message = "Username is required") @Pattern(regexp = "^[a-zA-Z0-9_-]+$", message = "Username can only contain letters, numbers, hyphen, and underscores") String nickname,

		@NotBlank(message = "Email is required") @Email(message = "Email should be valid") String email,
		@NotBlank(message = "Password is required") String password,
		String role,

		String avatar,
		LocalDateTime bannedUntil,
		LocalDateTime birthDate,
		LocalDateTime createdAt,
		LocalDateTime updatedAt) {

	public UserRecord(String nickname, String email, String password) {
		this(0L, nickname, email, password, null, null, null, null, null, null);
	}
}