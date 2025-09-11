package api.model.user;

import java.time.LocalDateTime;

public record UserRecord(
		long id,
		String nickname,

		
		String email,
		String password,
		String role,

		String avatar,
		LocalDateTime bannedUntil,
		LocalDateTime birthDate,
		LocalDateTime createdAt,
		LocalDateTime updatedAt) {
}