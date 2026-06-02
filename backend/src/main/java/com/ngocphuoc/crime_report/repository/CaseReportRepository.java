package com.ngocphuoc.crime_report.repository;

import com.ngocphuoc.crime_report.entity.CaseReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CaseReportRepository extends JpaRepository<CaseReport, Long> {

    boolean existsByTrackingCode(String trackingCode);

    Optional<CaseReport> findByTrackingCode(String trackingCode);
}
