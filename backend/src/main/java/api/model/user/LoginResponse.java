package api.model.user;

public record LoginResponse(String token, String email, Long id) {}