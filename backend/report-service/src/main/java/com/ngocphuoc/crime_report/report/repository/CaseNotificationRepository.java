package com.ngocphuoc.crime_report.report.repository;

import com.ngocphuoc.crime_report.report.entity.CaseNotification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.time.LocalDateTime;

public interface CaseNotificationRepository extends JpaRepository<CaseNotification, Long> {
    List<CaseNotification> findByCaseIdAndIsPublicTrueOrderByCreatedAtAsc(Long caseId);

    List<CaseNotification> findByCaseIdAndNotificationTypeAndIsPublicTrueOrderByCreatedAtDesc(
            Long caseId,
            String notificationType
    );

    long countByIsPublicTrueAndCreatedAtGreaterThanEqual(LocalDateTime from);

    List<CaseNotification> findTop6ByIsPublicTrueOrderByCreatedAtDesc();
}
