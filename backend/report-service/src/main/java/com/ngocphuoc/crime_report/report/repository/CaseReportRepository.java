package com.ngocphuoc.crime_report.report.repository;

import com.ngocphuoc.crime_report.enums.CaseStatus;
import com.ngocphuoc.crime_report.enums.UrgencyLevel;
import com.ngocphuoc.crime_report.report.dto.response.HeatmapPointResponse;
import com.ngocphuoc.crime_report.report.entity.CaseReport;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CaseReportRepository extends JpaRepository<CaseReport, Long> {

    boolean existsByTrackingCode(String trackingCode);

    Optional<CaseReport> findByTrackingCode(String trackingCode);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        SELECT c
        FROM CaseReport c
        WHERE c.id = :caseId
        """)
    Optional<CaseReport> findByIdForUpdate(@Param("caseId") Long caseId);

    @Query("""
            SELECT c
            FROM CaseReport c
            WHERE (
                    c.assignedOfficerId = :officerId
                    OR c.assignedUnitId = :unitId
                  )
              AND (:status IS NULL OR c.status = :status)
              AND (:urgencyLevel IS NULL OR c.urgencyLevel = :urgencyLevel)
            ORDER BY c.createdAt DESC
            """)
    Page<CaseReport> findOfficerVisibleCases(
            @Param("officerId") Long officerId,
            @Param("unitId") Long unitId,
            @Param("status") CaseStatus status,
            @Param("urgencyLevel") UrgencyLevel urgencyLevel,
            Pageable pageable
    );

    @Query("""
            SELECT c
            FROM CaseReport c
            WHERE c.assignedOfficerId = :officerId
              AND (:status IS NULL OR c.status = :status)
              AND (:urgencyLevel IS NULL OR c.urgencyLevel = :urgencyLevel)
            ORDER BY c.createdAt DESC
            """)
    Page<CaseReport> findAssignedOfficerCases(
            @Param("officerId") Long officerId,
            @Param("status") CaseStatus status,
            @Param("urgencyLevel") UrgencyLevel urgencyLevel,
            Pageable pageable
    );

    @Query("""
        SELECT c
        FROM CaseReport c
        where c.assignedUnitId = :unitId
        AND (:status IS NULL OR c.status = :status)
        AND (:urgencyLevel IS NULL OR c.urgencyLevel = :urgencyLevel)
        ORDER BY c.createdAt DESC
    """)
    Page<CaseReport> findUnitCases(
            @Param("unitId") Long unitId,
            @Param("status") CaseStatus status,
            @Param("urgencyLevel") UrgencyLevel urgencyLevel,
            Pageable pageable
    );

    @Query("""
            SELECT c
            FROM CaseReport c
            WHERE (:status IS NULL OR c.status = :status)
              AND (:urgencyLevel IS NULL OR c.urgencyLevel = :urgencyLevel)
            ORDER BY c.createdAt DESC
            """)
    Page<CaseReport> findAdminCases(
            @Param("status") CaseStatus status,
            @Param("urgencyLevel") UrgencyLevel urgencyLevel,
            Pageable pageable
    );

    @Query("""
            SELECT c
            FROM CaseReport c
            JOIN c.crimeType ct
            WHERE (:status IS NULL OR c.status = :status)
              AND (:urgencyLevel IS NULL OR c.urgencyLevel = :urgencyLevel)
              AND (
                    :keyword IS NULL
                    OR LOWER(c.trackingCode) LIKE :keyword
                    OR LOWER(c.description) LIKE :keyword
                    OR LOWER(c.addressText) LIKE :keyword
                    OR LOWER(ct.name) LIKE :keyword
                  )
            ORDER BY c.createdAt DESC
            """)
    Page<CaseReport> findCommanderCases(
            @Param("status") CaseStatus status,
            @Param("urgencyLevel") UrgencyLevel urgencyLevel,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    long countByStatus(CaseStatus status);

    long countByUrgencyLevel(UrgencyLevel urgencyLevel);

    @Query("""
        SELECT new com.ngocphuoc.crime_report.report.dto.response.HeatmapPointResponse(
                    c.id,
                    c.latitude,
                    c.longitude,
                    c.urgencyLevel,
                    ct.name,
                    c.status,
                    c.createdAt
                )
        FROM CaseReport c
        JOIN c.crimeType ct
        WHERE c.latitude IS NOT NULL
            AND c.longitude IS NOT NULL
            AND (:fromTime IS NULL OR c.createdAt >= :fromTime)
            AND (:toTime IS NULL OR c.createdAt <= :toTime)
            AND (:urgencyLevel IS NULL OR c.urgencyLevel = :urgencyLevel)
        ORDER BY c.createdAt DESC
    """)
    List<HeatmapPointResponse> findHeatMapPoints(
            @Param("fromTime") LocalDateTime fromTime,
            @Param("toTime") LocalDateTime toTime,
            @Param("urgencyLevel") UrgencyLevel urgencyLevel
    );
}
