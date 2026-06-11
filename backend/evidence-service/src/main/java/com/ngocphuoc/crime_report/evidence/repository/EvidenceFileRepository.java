package com.ngocphuoc.crime_report.evidence.repository;

import com.ngocphuoc.crime_report.evidence.entity.EvidenceFile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EvidenceFileRepository extends JpaRepository<EvidenceFile, Long> {

    List<EvidenceFile> findByCaseIdOrderByUploadedAtDesc(Long caseId);

    List<EvidenceFile> findByTrackingCodeOrderByUploadedAtDesc(String trackingCode);
}
