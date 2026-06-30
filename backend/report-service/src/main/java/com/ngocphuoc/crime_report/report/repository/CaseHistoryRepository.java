package com.ngocphuoc.crime_report.report.repository;

import com.ngocphuoc.crime_report.report.dto.response.CommanderActivityResponse;
import com.ngocphuoc.crime_report.report.entity.CaseHistory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CaseHistoryRepository extends JpaRepository<CaseHistory, Long> {
    List<CaseHistory> findByCaseIdOrderByCreatedAtDesc(Long caseId);

    @Query("""
            SELECT new com.ngocphuoc.crime_report.report.dto.response.CommanderActivityResponse(
                h.id,
                c.id,
                c.trackingCode,
                h.action,
                COALESCE(h.note, c.description),
                'Commander',
                c.urgencyLevel,
                h.createdAt
            )
            FROM CaseHistory h
            JOIN CaseReport c ON c.id = h.caseId
            ORDER BY h.createdAt DESC
            """)
    List<CommanderActivityResponse> findRecentCommanderActivities(Pageable pageable);
}
