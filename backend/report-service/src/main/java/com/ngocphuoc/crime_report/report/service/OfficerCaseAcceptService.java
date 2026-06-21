package com.ngocphuoc.crime_report.report.service;

import com.ngocphuoc.crime_report.common.ErrorCode;
import com.ngocphuoc.crime_report.enums.AuditAction;
import com.ngocphuoc.crime_report.enums.AuditResourceType;
import com.ngocphuoc.crime_report.enums.CaseHistoryAction;
import com.ngocphuoc.crime_report.enums.CaseStatus;
import com.ngocphuoc.crime_report.report.dto.response.AcceptCaseResponse;
import com.ngocphuoc.crime_report.report.dto.response.AuditLogCommand;
import com.ngocphuoc.crime_report.report.dto.response.CaseLockResponse;
import com.ngocphuoc.crime_report.report.entity.CaseHistory;
import com.ngocphuoc.crime_report.report.entity.CaseReport;
import com.ngocphuoc.crime_report.report.helper.GetFirstRole;
import com.ngocphuoc.crime_report.report.repository.CaseHistoryRepository;
import com.ngocphuoc.crime_report.report.repository.CaseReportRepository;
import com.ngocphuoc.crime_report.shared.exception.AppException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class OfficerCaseAcceptService {

    private final CaseReportRepository caseReportRepository;
    private final CaseHistoryRepository caseHistoryRepository;
    private final OfficerPermissionService officerPermissionService;
    private final CaseLockService caseLockService;
    private final AuditLogService auditLogService;
    private final AuditRequestMetadataResolver auditRequestMetadataResolver;
    private final GetFirstRole getRoleService;

    @Transactional
    public AcceptCaseResponse acceptCase(
        Long currentUserId,
        Authentication authentication,
        Long caseId,
        HttpServletRequest httpServletRequest
    ){
        // Find case report
        CaseReport caseReport = caseReportRepository.findById(caseId)
                .orElseThrow(() -> new AppException(ErrorCode.CASE_NOT_FOUND));

        // Check permission officer
        officerPermissionService.validateCanViewCase(currentUserId, authentication, caseReport);

        CaseStatus oldStatus = caseReport.getStatus();
        // Check status of case report
        if (oldStatus != CaseStatus.NEW_RECEIVED){
            throw new AppException(ErrorCode.CASE_STATUS_NOT_ACCEPTABLE);
        }
        // Lock case report for officer
        CaseLockResponse caseLockResponse = caseLockService
                .acquireLock(currentUserId, authentication, caseId, httpServletRequest);

        // Update status NEW_RECEIVED -> UNDER_VERIFICATION
        caseReport.setStatus(CaseStatus.UNDER_VERIFICATION);
        saveHistory(
                caseReport,
                currentUserId,
                caseLockResponse,
                oldStatus
        );

        // Write Audit Log
        auditLogService.writeLog(new AuditLogCommand(
                currentUserId,
                getRoleService.getFirstRole(authentication),
                AuditAction.CASE_ACCEPTED,
                AuditResourceType.CASE_REPORT,
                caseReport.getId(),
                oldStatus.name(),
                CaseStatus.UNDER_VERIFICATION.name(),
                "Officer accepted case",
                auditRequestMetadataResolver.getIpAddress(httpServletRequest),
                auditRequestMetadataResolver.getUserAgent(httpServletRequest),
                "officerId=" + caseLockResponse.lockedByOfficerId()
                        + ", unitId=" + caseLockResponse.lockedByUnitId()
        ));

        return new AcceptCaseResponse(
                caseReport.getId(),
                caseReport.getTrackingCode(),
                caseReport.getStatus(),
                caseReport.getAssignedUnitId(),
                caseReport.getAssignedOfficerId(),
                caseLockResponse
        );
    }

    private void saveHistory(
            CaseReport caseReport,
            Long currentUserId,
            CaseLockResponse caseLockResponse,
            CaseStatus oldStatus
    ) {
        CaseHistory history = new CaseHistory();
        history.setCaseId(caseReport.getId());
        history.setActorUserId(currentUserId);
        history.setActorOfficerId(caseLockResponse.lockedByOfficerId());
        history.setActorUnitId(caseLockResponse.lockedByUnitId());
        history.setAction(CaseHistoryAction.CASE_ACCEPTED.name());
        history.setOldStatus(oldStatus.name());
        history.setNewStatus(CaseStatus.UNDER_VERIFICATION.name());
        history.setNote("Officer accepted case and changed status to UNDER_VERIFICATION");

        caseHistoryRepository.save(history);
    }
}
