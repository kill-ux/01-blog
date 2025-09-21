package api.model.report;

import java.time.LocalDateTime;

import api.model.user.UserResponse;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReportRequests {
    public record ReportRequestDto(
            @NotNull(message = "reason is required!!") String reason,
            Long blogId,
            Long userId) {
        public boolean isValid() {
            return blogId != null || userId != null;
        }
    }

    @Data
    public static class ReportResponce {
        private long id;
        private String reason;
        private boolean status;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private Long blogId;
        private UserResponse reportingUser;
        private UserResponse reportedUser;

        public ReportResponce(Report report) {
            this.id = report.getId();
            this.reason = report.getReason();
            this.status = report.isStatus();
            this.createdAt = report.getCreatedAt();
            this.updatedAt = report.getUpdatedAt();
            this.blogId = report.getBlogId();
            this.reportingUser = new UserResponse(report.getReportingUser());
            this.reportedUser = new UserResponse(report.getReportedUser());
        }
    }
}
