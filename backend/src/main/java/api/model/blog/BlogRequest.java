package api.model.blog;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record BlogRequest(
        @Size(max = 255, message = "title must not exceed 255 characters")
        String title,
        @Size(max = 5000, message = "Description must not exceed 5000 characters")
        @NotBlank(message = "description is required")
        String description,

        Long parent,
        String mediaUrl,
        String mediaType) {
}