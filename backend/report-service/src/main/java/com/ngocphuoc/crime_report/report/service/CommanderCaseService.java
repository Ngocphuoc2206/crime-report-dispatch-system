package com.ngocphuoc.crime_report.report.service;

import com.ngocphuoc.crime_report.common.ErrorCode;
import com.ngocphuoc.crime_report.enums.CaseStatus;
import com.ngocphuoc.crime_report.enums.UrgencyLevel;
import com.ngocphuoc.crime_report.report.dto.request.UpdateCaseStatusRequest;
import com.ngocphuoc.crime_report.report.dto.response.CommanderActivityResponse;
import com.ngocphuoc.crime_report.report.dto.response.CommanderCaseDetailResponse;
import com.ngocphuoc.crime_report.report.dto.response.CommanderCaseHistoryResponse;
import com.ngocphuoc.crime_report.report.dto.response.CommanderCaseResponse;
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

        return toDetailResponse(caseReport, histories);
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
                caseReport.getCreatedAt(),
                caseReport.getUpdatedAt()
        );
    }

    private CommanderCaseDetailResponse toDetailResponse(
            CaseReport caseReport,
            List<CommanderCaseHistoryResponse> histories
    ) {
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
                caseReport.getCreatedAt(),
                caseReport.getUpdatedAt(),
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
}
