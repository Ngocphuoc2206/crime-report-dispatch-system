package com.ngocphuoc.crime_report.report.service;

import com.ngocphuoc.crime_report.common.ErrorCode;
import com.ngocphuoc.crime_report.enums.CaseStatus;
import com.ngocphuoc.crime_report.report.client.dispatch.DispatchClient;
import com.ngocphuoc.crime_report.report.dto.request.UpdateCaseStatusRequest;
import com.ngocphuoc.crime_report.report.dto.response.OfficerProfileResponse;
import com.ngocphuoc.crime_report.report.dto.response.UpdateCaseStatusResponse;
import com.ngocphuoc.crime_report.report.entity.AuditLog;
import com.ngocphuoc.crime_report.report.entity.CaseHistory;
import com.ngocphuoc.crime_report.report.entity.CaseReport;
import com.ngocphuoc.crime_report.report.repository.AuditLogRepository;
import com.ngocphuoc.crime_report.report.repository.CaseHistoryRepository;
import com.ngocphuoc.crime_report.report.repository.CaseReportRepository;
import com.ngocphuoc.crime_report.shared.exception.AppException;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class OfficerCaseStatusService {

    private final CaseReportRepository caseReportRepository;
    private final OfficerPermissionService officerPermissionService;
    private final CaseLockService caseLockService;
    private final CaseStatusStateMachine caseStatusStateMachine;
    private final DispatchClient dispatchClient;
    private final CaseHistoryRepository caseHistoryRepository;
    private final AuditLogRepository auditLogRepository;

    public UpdateCaseStatusResponse updateStatus(
            Long currentUserId,
            Authentication authentication,
            Long caseId,
            UpdateCaseStatusRequest updateCaseStatusRequest)
    {
        // Find caseReportById
        CaseReport caseReport = caseReportRepository.findById(caseId)
                .orElseThrow(() -> new AppException(ErrorCode.CASE_NOT_FOUND));

        // Check permission officer
        officerPermissionService.validateCanViewCase(currentUserId, authentication, caseReport);

        // Check caseLock isActive?
        caseLockService.validateActiveLockOwnedByUser(currentUserId, caseId);

        CaseStatus oldStatus = caseReport.getStatus();
        CaseStatus newStatus = updateCaseStatusRequest.caseStatus();

        if (!caseStatusStateMachine.canTransition(oldStatus, newStatus)){
            throw new AppException(ErrorCode.INVALID_CASE_STATUS_TRANSITION);
        }

        validateRoleTransition(authentication, oldStatus, newStatus);

        OfficerProfileResponse officerProfileResponse = dispatchClient.getOfficerByUserId(currentUserId);

        caseReport.setStatus(newStatus);

        saveCaseHistory(
                caseReport,
                currentUserId,
                officerProfileResponse,
                oldStatus,
                newStatus,
                updateCaseStatusRequest.note()
        );

        saveAuditLog(
                currentUserId,
                authentication,
                caseReport.getId(),
                oldStatus,
                newStatus,
                updateCaseStatusRequest.note()
        );
        return new UpdateCaseStatusResponse(
                caseReport.getId(),
                caseReport.getTrackingCode(),
                oldStatus,
                newStatus,
                updateCaseStatusRequest.note(),
                LocalDateTime.now()
        );
    }

    private void saveCaseHistory(
            CaseReport caseReport,
            Long currentUserId,
            OfficerProfileResponse officerProfileResponse,
            CaseStatus oldStatus, CaseStatus newStatus,
            @Size(max = 500) String note)
    {
        CaseHistory history = new CaseHistory();

        history.setCaseId(caseReport.getId());
        history.setActorUserId(currentUserId);
        history.setActorOfficerId(officerProfileResponse.officerId());
        history.setActorUnitId(officerProfileResponse.unitId());
        history.setAction("CASE_STATUS_CHANGED");
        history.setOldStatus(oldStatus.name());
        history.setNewStatus(newStatus.name());
        history.setNote(note);

        caseHistoryRepository.save(history);
    }

    private void saveAuditLog(
            Long currentUserId,
            Authentication authentication,
            Long caseId,
            CaseStatus oldStatus,
            CaseStatus newStatus,
            String note
    ) {
        AuditLog auditLog = new AuditLog();
        auditLog.setActorUserId(currentUserId);
        auditLog.setActorRole(getFirstRole(authentication));
        auditLog.setAction("CASE_STATUS_CHANGED");
        auditLog.setResourceType("CASE_REPORT");
        auditLog.setResourceId(caseId);
        auditLog.setOldValue(oldStatus.name());
        auditLog.setNewValue(newStatus.name());
        auditLog.setNote(note);

        auditLogRepository.save(auditLog);
    }

    private void validateRoleTransition(Authentication authentication, CaseStatus oldStatus, CaseStatus newStatus) {
        if (hasRole(authentication, "ROLE_ADMIN")){
            return;
        }

        if (hasRole(authentication, "ROLE_COMMANDER")){
            return;
        }

        if (hasRole(authentication, "ROLE_OFFICER")){
            if (oldStatus == CaseStatus.UNDER_VERIFICATION && (
                    newStatus == CaseStatus.TRANSFERRED_TO_INVESTIGATION
                    || newStatus == CaseStatus.RESOLVED
                    || newStatus == CaseStatus.SPAM_OR_FAKE
            )){
                return;
            }
            throw new AppException(ErrorCode.ROLE_NOT_ALLOWED_FOR_TRANSITION);
        }
        throw new AppException(ErrorCode.ACCESS_DENIED);
    }

    private boolean hasRole(Authentication authentication, String roleOfficer) {
        return authentication.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(roleOfficer::equals);
    }

    private String getFirstRole(Authentication authentication){
        return authentication.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse(null);
    }
}
