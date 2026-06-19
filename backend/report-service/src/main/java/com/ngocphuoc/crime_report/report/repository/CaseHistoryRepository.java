package com.ngocphuoc.crime_report.report.repository;

import com.ngocphuoc.crime_report.report.entity.CaseHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CaseHistoryRepository extends JpaRepository<CaseHistory, Long> {
    List<CaseHistory> findByCaseIdOrderByCreatedAtDesc(Long caseId);
}
