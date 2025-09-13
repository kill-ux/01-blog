package api.model.blog;

import jakarta.validation.constraints.NotBlank;

public record BlogRequest(
        @NotBlank(message = "user_id is required")
        long userId,
        @NotBlank(message = "description is required")
        String description,

        long parent,
        String media_url,
        String media_type) {
}