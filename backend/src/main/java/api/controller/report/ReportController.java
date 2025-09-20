package api.controller.report;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import api.model.report.ReportRequest;
import api.service.ReportService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/reports")
public class ReportController {
    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping("/store")
    public ResponseEntity<String> reportUser(@Valid ReportRequest request) {
        this.reportService.reportUser(request);
        return ResponseEntity.ok("success reported");
    }
}
