package api.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import api.model.report.Report;

public interface ReportRepository extends JpaRepository<Report, Long> {
    Page<Report> findByIdLessThan(long cursor, Pageable pageable);
}