package com.ngocphuoc.crime_report.report.repository;

import com.ngocphuoc.crime_report.report.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
}
