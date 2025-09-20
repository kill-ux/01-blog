package api.model.report;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReportRequest {

    @NotBlank(message = "Reason is required")
    private String reason;
    private Long blogId;
    private Long userId;

    public boolean isValid() {
        return blogId != null || userId != null;
    }
}