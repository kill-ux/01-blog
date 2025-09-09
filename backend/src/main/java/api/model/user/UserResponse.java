package api.model.user;

public record UserResponse(
        Long id,
        String email,
        String avatar,
        String role) {
}