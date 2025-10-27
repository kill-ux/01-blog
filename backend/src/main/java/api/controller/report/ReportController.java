package api.controller.report;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import api.model.report.MostRportUser.MostReport;
import api.model.report.ReportRequests.ReportRequestDto;
import api.model.report.ReportRequests.ReportResponce;
import api.model.user.UserResponse;
// import api.model.report.ReportRequest;
import api.service.ReportService;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import jakarta.validation.Valid;

@RestController
@RateLimiter(name = "myApiLimiter")
@RequestMapping("/api/reports")
public class ReportController {
    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping("/store")
    public ResponseEntity<ReportResponce> reportUser(@Valid @RequestBody ReportRequestDto request) {
        System.out.println(request);
        if (!request.isValid()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "must be blogId or userId");
        }
        return ResponseEntity.ok(this.reportService.reportUser(request));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReportResponce>> getReports(@RequestParam(defaultValue = "0") long cursor) {
        return ResponseEntity.ok(this.reportService.getReports(cursor));
    }

    @GetMapping("/mostreported")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<MostReport>> getMostReportedUsers() {
        return ResponseEntity.ok(this.reportService.getMostReportedUsers());
    }

    @PatchMapping("{reportId}/review")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReportResponce> changeStatus(@PathVariable long reportId) {
        return ResponseEntity.ok(this.reportService.changeStatus(reportId));
    }

    @GetMapping("{reportId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReportResponce> getReport(@PathVariable long reportId) {
        return ResponseEntity.ok(this.reportService.getReport(reportId));
    }
}
