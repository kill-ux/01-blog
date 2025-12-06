package api.service;

import java.util.List;

import org.springframework.data.domain.*;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;

import api.model.blog.Blog;
import api.model.report.Report;
import api.model.report.MostRportUser.MostReportedUnit;
import api.model.report.ReportRequests.ReportRequestDto;
import api.model.report.ReportRequests.ReportResponce;
import api.model.user.User;
import api.repository.BlogRepository;
import api.repository.ReportRepository;
import api.repository.UserRepository;

/**
 * Service for handling user and blog reports.
 * Provides methods for creating, retrieving, and managing reports.
 */
@Service
public class ReportService {
    private final ReportRepository reportRepository;
    private final BlogRepository blogRepository;
    private final UserRepository userRepository;
    private final AuthUtils authUtils;

    public ReportService(ReportRepository reportRepository, BlogRepository blogRepository,
            UserRepository userRepository, AuthUtils authUtils) {
        this.reportRepository = reportRepository;
        this.blogRepository = blogRepository;
        this.userRepository = userRepository;
        this.authUtils = authUtils;
    }

    /**
     * Creates a new report for a user or a blog.
     * @param request The report request data.
     * @return The created report.
     */
    public ReportResponce reportUser(ReportRequestDto request) {
        User user;
        Report report = new Report();
        if (request.blogId() != null) {
            Blog blog = this.blogRepository.findById(request.blogId()).get();
            report.setBlogId(request.blogId());
            user = blog.getUser();
        } else {
            user = this.userRepository.findById(request.userId()).get();
        }
        report.setReason(request.reason());
        report.setReportedUser(user);
        User current = this.authUtils.getAuthenticatedUser();
        report.setReportingUser(current);

        return new ReportResponce(this.reportRepository.save(report));
    }

    /**
     * Retrieves a paginated list of all reports.
     * @param cursor The pagination cursor.
     * @return A list of reports.
     */
    public List<ReportResponce> getReports(long cursor) {
        if (cursor == 0) {
            cursor = Long.MAX_VALUE;
        }
        Pageable pageable = PageRequest.of(0, 10, Direction.DESC, "id");
        return this.reportRepository.findByIdLessThan(cursor, pageable).map(ReportResponce::new).toList();
    }

    /**
     * Retrieves a list of the most reported users.
     * @return A list of the most reported users.
     */
    public List<MostReportedUnit> getMostReportedUsers() {
        return this.reportRepository.getMostReportedUsers();
    }

    /**
     * Changes the status of a report.
     * @param reportId The ID of the report to update.
     * @return The updated report.
     */
    public ReportResponce changeStatus(long reportId) {
        Report report = this.reportRepository.findById(reportId).get();
        report.setStatus(!report.isStatus());
        return new ReportResponce(this.reportRepository.save(report));
    }

    /**
     * Retrieves a single report by its ID.
     * @param reportId The ID of the report to retrieve.
     * @return The requested report.
     */
    public ReportResponce getReport(long reportId) {
        return new ReportResponce(this.reportRepository.findById(reportId).get());
    }
}
