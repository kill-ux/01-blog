package api.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import api.model.report.Report;
public interface ReportRepository extends JpaRepository<Report, Long> {
    Page<Report> findByIdLessThan(long cursor, Pageable pageable);

    @Query("SELECT auth , COUNT(*) as reportCount from Report r JOIN r.reportedUser auth GROUP BY auth ORDER BY reportCount DESC LIMIT 3")
    List<Object[]> getMostReportedUsers();
}


