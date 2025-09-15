package api.model.user;

import java.time.LocalDateTime;

public record UserDto(
		long id,
		String nickname,
		String email,
		String role,

		String avatar,
		LocalDateTime bannedUntil,
		LocalDateTime birthDate,
		LocalDateTime createdAt,
		LocalDateTime updatedAt) {
}