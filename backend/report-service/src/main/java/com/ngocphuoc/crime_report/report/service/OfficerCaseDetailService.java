package com.ngocphuoc.crime_report.report.service;

import com.ngocphuoc.crime_report.common.ErrorCode;
import com.ngocphuoc.crime_report.identity.service.ReporterIdentityService;
import com.ngocphuoc.crime_report.report.client.evidence.EvidenceClient;
import com.ngocphuoc.crime_report.report.dto.response.EvidenceMetadataResponse;
import com.ngocphuoc.crime_report.report.dto.response.OfficerCaseDetailResponse;
import com.ngocphuoc.crime_report.report.dto.response.OfficerCaseHistoryResponse;
import com.ngocphuoc.crime_report.report.dto.response.ReporterInfoResponse;
import com.ngocphuoc.crime_report.report.entity.CaseHistory;
import com.ngocphuoc.crime_report.report.entity.CaseReport;
import com.ngocphuoc.crime_report.report.repository.CaseHistoryRepository;
import com.ngocphuoc.crime_report.report.repository.CaseReportRepository;
import com.ngocphuoc.crime_report.shared.exception.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OfficerCaseDetailService {
    private final CaseReportRepository caseReportRepository;
    private final EvidenceClient evidenceClient;
    private final ReporterIdentityService reporterIdentityService;
    private final OfficerPermissionService officerPermissionService;
    private final CaseHistoryRepository caseHistoryRepository;

    @Transactional(readOnly = true)
    public OfficerCaseDetailResponse getCaseDetail(
            Long currentUserId,
            Authentication authentication,
            Long caseId
    ){
        CaseReport caseReport = caseReportRepository.findById(caseId)
                .orElseThrow(() -> new AppException(ErrorCode.CASE_NOT_FOUND));

        officerPermissionService.validateCanViewCase(currentUserId, authentication, caseReport);

        List<EvidenceMetadataResponse> evidences =
                evidenceClient.getEvidenceMetadataByCaseId(caseReport.getId());

        List<OfficerCaseHistoryResponse> histories = caseHistoryRepository
                .findByCaseIdOrderByCreatedAtDesc(caseReport.getId())
                .stream()
                .map(this::toHistoryResponse)
                .toList();

        return toResponse(caseReport, evidences, histories);
    }

    private OfficerCaseDetailResponse toResponse(
            CaseReport caseReport,
            List<EvidenceMetadataResponse> evidences,
            List<OfficerCaseHistoryResponse> histories
    ){
        ReporterInfoResponse reporter = reporterIdentityService.findReporterInfo(caseReport.getId())
                .orElse(null);
        boolean isAnonymous = reporter == null;

        return new OfficerCaseDetailResponse(
                caseReport.getId(),
                caseReport.getTrackingCode(),

                caseReport.getDescription(),
                String.valueOf(caseReport.getCrimeType().getName()),
                caseReport.getStatus(),
                String.valueOf(caseReport.getUrgencyLevel()),

                caseReport.getLatitude(),
                caseReport.getLongitude(),
                caseReport.getAddressText(),

                caseReport.getAssignedUnitId(),
                caseReport.getAssignedOfficerId(),

                isAnonymous,
                reporter,

                caseReport.getSpamScore(),
                caseReport.getSpamLevel(),
                caseReport.getSpamReasons(),
                caseReport.getFakeScore(),
                caseReport.getAiConfidence(),
                caseReport.getAiDecision(),
                caseReport.getSpamDetectionSource(),
                caseReport.getAiModel(),
                caseReport.getAiCheckedAt(),
                caseReport.getAiError(),

                caseReport.getCreatedAt(),
                caseReport.getUpdatedAt(),

                evidences,
                histories
        );
    }

    private OfficerCaseHistoryResponse toHistoryResponse(CaseHistory history) {
        return new OfficerCaseHistoryResponse(
                history.getId(),
                history.getAction(),
                history.getOldStatus(),
                history.getNewStatus(),
                history.getNote(),
                history.getActorUserId(),
                history.getActorOfficerId(),
                history.getActorUnitId(),
                history.getCreatedAt()
        );
    }

}
