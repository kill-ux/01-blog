package api.model.user;

public record UserDto(
        Long id,
        String email,
        String avatar,
        String role) {
}