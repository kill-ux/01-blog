package api.model.report;

import java.util.List;

import api.model.user.User;
import api.model.user.UserResponse;
import lombok.Data;

// @Data

public class MostRportUser {

        public record MostReport(
                        UserResponse user,
                        long reportCount) {
        }

        public record MostReportU(
                        User user,
                        long reportCount) {
        }

        public record MostReportedUnit(String nickname, Long reportCount) {
        }

}