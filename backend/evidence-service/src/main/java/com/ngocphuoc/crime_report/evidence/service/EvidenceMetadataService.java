package com.ngocphuoc.crime_report.evidence.service;

import com.ngocphuoc.crime_report.evidence.dto.EvidenceMetadataResponse;
import com.ngocphuoc.crime_report.evidence.entity.EvidenceFile;
import com.ngocphuoc.crime_report.evidence.repository.EvidenceFileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EvidenceMetadataService {
    private final EvidenceFileRepository evidenceFileRepository;

    @Transactional(readOnly = true)
    public List<EvidenceMetadataResponse> getEvidenceMetadataByCaseId(Long caseId) {
        return evidenceFileRepository.findByCaseIdOrderByUploadedAtAsc(caseId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private EvidenceMetadataResponse toResponse(EvidenceFile evidenceFile) {
        return new EvidenceMetadataResponse(
                evidenceFile.getId(),
                evidenceFile.getCaseId(),
                evidenceFile.getOriginalFileName(),
                String.valueOf(evidenceFile.getFileType()),
                evidenceFile.getFileSize(),
                evidenceFile.getFileType().name(),
                evidenceFile.getChecksum(),
                evidenceFile.getUploadedAt()
        );
    }
}
