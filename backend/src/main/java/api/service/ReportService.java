package api.service;

import java.util.List;

import org.springframework.data.domain.*;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;

import api.model.blog.Blog;
import api.model.report.Report;
import api.model.report.ReportRequests.ReportRequestDto;
import api.model.report.ReportRequests.ReportResponce;
import api.model.user.User;
import api.repository.BlogRepository;
import api.repository.ReportRepository;
import api.repository.UserRepository;

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

    public List<ReportResponce> getReports(long cursor) {
        if (cursor == 0) {
            cursor = Long.MAX_VALUE;
        }
        Pageable pageable = PageRequest.of(0, 10, Direction.DESC, "id");
        return this.reportRepository.findByIdLessThan(cursor, pageable).map(ReportResponce::new).toList();
    }

    public ReportResponce changeStatus(long reportId) {
        Report report = this.reportRepository.findById(reportId).get();
        report.setStatus(!report.isStatus());
        return new ReportResponce(this.reportRepository.save(report));
    }

    public ReportResponce getReport(long reportId) {
        return new ReportResponce(this.reportRepository.findById(reportId).get());
    }
}
