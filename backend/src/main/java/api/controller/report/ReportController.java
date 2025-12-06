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

import api.model.report.MostRportUser.MostReportedUnit;
import api.model.report.ReportRequests.ReportRequestDto;
import api.model.report.ReportRequests.ReportResponce;
import api.service.ReportService;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import jakarta.validation.Valid;

/**
 * Controller for handling user and blog reports.
 * Provides endpoints for creating, retrieving, and managing reports.
 */
@RestController
@RateLimiter(name = "myApiLimiter")
@RequestMapping("/api/reports")
public class ReportController {
    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    /**
     * Submits a new report for a user or a blog.
     * @param request The report request data.
     * @return The created report.
     * @throws ResponseStatusException if the request is invalid.
     */
    @PostMapping("/store")
    public ResponseEntity<ReportResponce> reportUser(@Valid @RequestBody ReportRequestDto request) {
        System.out.println(request);
        if (!request.isValid()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "must be blogId or userId");
        }
        return ResponseEntity.ok(this.reportService.reportUser(request));
    }

    /**
     * Retrieves a list of all reports, intended for admin use.
     * @param cursor The pagination cursor.
     * @return A list of reports.
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReportResponce>> getReports(@RequestParam(defaultValue = "0") long cursor) {
        return ResponseEntity.ok(this.reportService.getReports(cursor));
    }

    /**
     * Retrieves a list of the most reported users, intended for admin use.
     * @return A list of the most reported users.
     */
    @GetMapping("/mostreported")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<MostReportedUnit>> getMostReportedUsers() {
        return ResponseEntity.ok(this.reportService.getMostReportedUsers());
    }

    /**
     * Changes the status of a report, intended for admin use.
     * @param reportId The ID of the report to update.
     * @return The updated report.
     */
    @PatchMapping("{reportId}/review")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReportResponce> changeStatus(@PathVariable long reportId) {
        return ResponseEntity.ok(this.reportService.changeStatus(reportId));
    }

    /**
     * Retrieves a single report by its ID, intended for admin use.
     * @param reportId The ID of the report to retrieve.
     * @return The requested report.
     */
    @GetMapping("{reportId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReportResponce> getReport(@PathVariable long reportId) {
        return ResponseEntity.ok(this.reportService.getReport(reportId));
    }
}
