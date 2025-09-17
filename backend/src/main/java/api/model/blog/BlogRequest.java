package api.model.blog;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record BlogRequest(
        @Size(max = 1000, message = "Description must not exceed 1000 characters")
        @NotBlank(message = "description is required")
        String description,

        Long parent,
        String mediaUrl,
        String mediaType) {
}