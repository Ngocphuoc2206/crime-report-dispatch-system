package com.ngocphuoc.crime_report.report.service;

import com.ngocphuoc.crime_report.common.ErrorCode;
import com.ngocphuoc.crime_report.enums.CaseStatus;
import com.ngocphuoc.crime_report.enums.UrgencyLevel;
import com.ngocphuoc.crime_report.identity.service.ReporterIdentityService;
import com.ngocphuoc.crime_report.report.dto.request.UpdateCaseStatusRequest;
import com.ngocphuoc.crime_report.report.dto.response.CommanderActivityResponse;
import com.ngocphuoc.crime_report.report.dto.response.CommanderCaseDetailResponse;
import com.ngocphuoc.crime_report.report.dto.response.CommanderCaseHistoryResponse;
import com.ngocphuoc.crime_report.report.dto.response.CommanderCaseResponse;
import com.ngocphuoc.crime_report.report.client.dispatch.DispatchClient;
import com.ngocphuoc.crime_report.report.client.evidence.EvidenceClient;
import com.ngocphuoc.crime_report.report.dto.response.EvidenceMetadataResponse;
import com.ngocphuoc.crime_report.report.dto.response.ReporterInfoResponse;
import com.ngocphuoc.crime_report.report.entity.CaseHistory;
import com.ngocphuoc.crime_report.report.entity.CaseReport;
import com.ngocphuoc.crime_report.report.repository.CaseHistoryRepository;
import com.ngocphuoc.crime_report.report.repository.CaseReportRepository;
import com.ngocphuoc.crime_report.shared.exception.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommanderCaseService {

    private final CaseReportRepository caseReportRepository;
    private final CaseHistoryRepository caseHistoryRepository;
    private final CaseStatusStateMachine caseStatusStateMachine;
    private final DispatchClient dispatchClient;
    private final EvidenceClient evidenceClient;
    private final ReporterIdentityService reporterIdentityService;

    @Transactional(readOnly = true)
    public Page<CommanderCaseResponse> getCases(
            CaseStatus status,
            UrgencyLevel urgencyLevel,
            String keyword,
            Pageable pageable
    ) {
        return caseReportRepository.findCommanderCases(status, urgencyLevel, normalizeKeyword(keyword), pageable)
                .map(this::toCaseResponse);
    }

    @Transactional(readOnly = true)
    public CommanderCaseDetailResponse getDetail(String trackingCode) {
        CaseReport caseReport = caseReportRepository.findByTrackingCode(trackingCode)
                .orElseThrow(() -> new AppException(ErrorCode.CASE_NOT_FOUND));

        List<CommanderCaseHistoryResponse> histories = caseHistoryRepository
                .findByCaseIdOrderByCreatedAtDesc(caseReport.getId())
                .stream()
                .map(this::toHistoryResponse)
                .toList();

        List<EvidenceMetadataResponse> evidences =
                evidenceClient.getEvidenceMetadataByCaseId(caseReport.getId());

        return toDetailResponse(caseReport, histories, evidences);
    }

    @Transactional
    public CommanderCaseDetailResponse updateStatus(
            String trackingCode,
            Long currentUserId,
            UpdateCaseStatusRequest request
    ) {
        CaseReport caseReport = caseReportRepository.findByTrackingCode(trackingCode)
                .orElseThrow(() -> new AppException(ErrorCode.CASE_NOT_FOUND));

        CaseStatus oldStatus = caseReport.getStatus();
        CaseStatus newStatus = request.caseStatus();

        if (!caseStatusStateMachine.canTransition(oldStatus, newStatus)) {
            throw new AppException(ErrorCode.INVALID_CASE_STATUS_TRANSITION);
        }

        caseReport.setStatus(newStatus);

        CaseHistory history = new CaseHistory();
        history.setCaseId(caseReport.getId());
        history.setActorUserId(currentUserId);
        history.setAction("COMMANDER_STATUS_CHANGED");
        history.setOldStatus(oldStatus.name());
        history.setNewStatus(newStatus.name());
        history.setNote(request.note());
        caseHistoryRepository.save(history);

        if (isTerminalStatus(newStatus)) {
            dispatchClient.completeDispatchForCase(
                    caseReport.getId(),
                    "Commander changed case status to " + newStatus.name()
            );
        }

        return getDetail(trackingCode);
    }

    @Transactional(readOnly = true)
    public List<CommanderActivityResponse> getActivities(int limit) {
        return caseHistoryRepository.findRecentCommanderActivities(Pageable.ofSize(Math.min(limit, 100)));
    }

    private CommanderCaseResponse toCaseResponse(CaseReport caseReport) {
        return new CommanderCaseResponse(
                caseReport.getId(),
                caseReport.getTrackingCode(),
                caseReport.getCrimeType().getName(),
                caseReport.getDescription(),
                caseReport.getStatus(),
                caseReport.getUrgencyLevel(),
                caseReport.getLatitude(),
                caseReport.getLongitude(),
                caseReport.getAddressText(),
                caseReport.getAssignedUnitId(),
                caseReport.getAssignedOfficerId(),
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
                caseReport.getUpdatedAt()
        );
    }

    private CommanderCaseDetailResponse toDetailResponse(
            CaseReport caseReport,
            List<CommanderCaseHistoryResponse> histories,
            List<EvidenceMetadataResponse> evidences
    ) {
        ReporterInfoResponse reporter = reporterIdentityService.findReporterInfo(caseReport.getId())
                .orElse(null);

        return new CommanderCaseDetailResponse(
                caseReport.getId(),
                caseReport.getTrackingCode(),
                caseReport.getCrimeType().getName(),
                caseReport.getDescription(),
                caseReport.getStatus(),
                caseReport.getUrgencyLevel(),
                caseReport.getLatitude(),
                caseReport.getLongitude(),
                caseReport.getAddressText(),
                caseReport.getAssignedUnitId(),
                caseReport.getAssignedOfficerId(),
                reporter == null,
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

    private CommanderCaseHistoryResponse toHistoryResponse(CaseHistory history) {
        return new CommanderCaseHistoryResponse(
                history.getId(),
                history.getAction(),
                history.getOldStatus(),
                history.getNewStatus(),
                history.getNote(),
                history.getActorUserId(),
                history.getCreatedAt()
        );
    }

    private String normalizeKeyword(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return null;
        }

        return "%" + keyword.trim().toLowerCase() + "%";
    }

    private boolean isTerminalStatus(CaseStatus status) {
        return status == CaseStatus.RESOLVED || status == CaseStatus.SPAM_OR_FAKE;
    }
}
