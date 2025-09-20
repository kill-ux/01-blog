package api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import api.model.report.Report;

public interface ReportRepository extends JpaRepository<Report, Long> {

    
}