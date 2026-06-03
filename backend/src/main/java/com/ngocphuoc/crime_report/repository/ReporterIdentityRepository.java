package com.ngocphuoc.crime_report.repository;

import com.ngocphuoc.crime_report.entity.ReporterIdentity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReporterIdentityRepository extends JpaRepository<ReporterIdentity, Long> {

    Optional<ReporterIdentity> findByCaseReportId(Long caseId);
}