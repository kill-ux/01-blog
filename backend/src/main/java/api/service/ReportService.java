package api.service;

import org.springframework.stereotype.Service;

import api.model.blog.Blog;
import api.model.report.Report;
import api.model.report.ReportRequest;
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

    public void reportUser(ReportRequest request) {
        User user;
        Report report = new Report();
        if (request.getBlogId() != null) {
            Blog blog = this.blogRepository.findById(request.getBlogId()).get();
            report.setBlog(blog);
            user = blog.getUser();
        } else {
            user = this.userRepository.findById(request.getUserId()).get();
        }
        report.setReason(request.getReason());
        report.setReportingUser(user);
        User current = this.authUtils.getAuthenticatedUser();
        report.setReportingUser(current);

        this.reportRepository.save(report);
    }
}
