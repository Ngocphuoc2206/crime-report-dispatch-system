package com.ngocphuoc.crime_report.report.repository;

import com.ngocphuoc.crime_report.report.dto.response.TimelineEventResponse;
import com.ngocphuoc.crime_report.report.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.awt.print.Pageable;
import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    @Query("""
        SELECT new com.ngocphuoc.crime_report.report.dto.response.TimelineEventResponse(
            c.id,
            c.trackingCode,
            a.action,
            COALESCE(a.note, a.action),
            c.urgencyLevel,
            a.createdAt
        )
        FROM AuditLog a, CaseReport c
        WHERE c.id = a.resourceId
          AND a.resourceType = 'CASE_REPORT'
        ORDER BY a.createdAt DESC, a.id DESC
        """)
    List<TimelineEventResponse> findLatestTimeline(Pageable pageable);
}
