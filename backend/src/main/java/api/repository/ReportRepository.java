package api.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import api.model.report.MostRportUser.MostReportedUnit;
import api.model.report.Report;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    Page<Report> findByIdLessThan(long cursor, Pageable pageable);

    @Query("SELECT r.reportedUser.nickname , COUNT(*) as reportCount from Report r GROUP BY r.reportedUser.nickname ORDER BY COUNT(*) DESC LIMIT 3")
    List<MostReportedUnit> getMostReportedUsers();
}
