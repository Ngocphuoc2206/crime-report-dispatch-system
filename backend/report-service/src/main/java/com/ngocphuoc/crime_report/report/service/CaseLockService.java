package com.ngocphuoc.crime_report.report.service;

import com.ngocphuoc.crime_report.common.ErrorCode;
import com.ngocphuoc.crime_report.enums.AuditAction;
import com.ngocphuoc.crime_report.enums.AuditResourceType;
import com.ngocphuoc.crime_report.enums.CaseLockStatus;
import com.ngocphuoc.crime_report.report.client.dispatch.DispatchClient;
import com.ngocphuoc.crime_report.report.dto.response.AuditLogCommand;
import com.ngocphuoc.crime_report.report.dto.response.CaseLockResponse;
import com.ngocphuoc.crime_report.report.dto.response.OfficerProfileResponse;
import com.ngocphuoc.crime_report.report.entity.CaseLock;
import com.ngocphuoc.crime_report.report.entity.CaseReport;
import com.ngocphuoc.crime_report.report.helper.GetFirstRole;
import com.ngocphuoc.crime_report.report.repository.CaseLockRepository;
import com.ngocphuoc.crime_report.report.repository.CaseReportRepository;
import com.ngocphuoc.crime_report.shared.exception.AppException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class CaseLockService {
    private final CaseLockRepository caseLockRepository;
    private final CaseReportRepository caseReportRepository;
    private final DispatchClient dispatchClient;
    private final OfficerPermissionService officerPermissionService;
    private final AuditLogService auditLogService;
    private final GetFirstRole getRoleService;
    private final AuditRequestMetadataResolver auditRequestMetadataResolver;

    @Value("${app.case-lock.ttl-minutes}")
    private long ttlMinutes;

    @Transactional
    public CaseLockResponse acquireLock(
            Long currentUserId,
            Authentication authentication,
            Long caseId,
            HttpServletRequest httpServletRequest
    ){
        LocalDateTime now = LocalDateTime.now();
        // Get information officer
        OfficerProfileResponse officerProfileResponse = dispatchClient.getOfficerByUserId(currentUserId);

        // Get case report by id
        CaseReport caseReport = caseReportRepository.findByIdForUpdate(caseId)
                .orElseThrow(() -> new AppException(ErrorCode.CASE_NOT_FOUND));
        // Validate permission role
        officerPermissionService.validateCanViewCase(currentUserId, authentication, caseReport);

        CaseLock caseLock = caseLockRepository.findByCaseIdForUpdate(caseId).orElse(null);

        // Check case lock
        if (caseLock == null){
            CaseLock newCaseLock = new CaseLock();
            newCaseLock.setCaseId(caseId);
            setCaseLock(currentUserId, now, officerProfileResponse, newCaseLock);
            caseLockRepository.save(newCaseLock);
            writeLockAudit(currentUserId, authentication, caseId, httpServletRequest, newCaseLock);

            return toResponse(newCaseLock, currentUserId, now);
        }

        // != null
        if (isActive(caseLock, now)){
            boolean lockedByMe = Objects.equals(caseLock.getLockedByUserId(), currentUserId);

            if (!lockedByMe){
                throw new AppException(ErrorCode.CASE_ALREADY_LOCKED);
            }

            caseLock.setExpiresAt(now.plusMinutes(ttlMinutes));
            caseLock.setLockStatus(CaseLockStatus.ACTIVE);
            caseLock.setReleasedAt(null);

            return toResponse(caseLock, currentUserId, now);
        }

        setCaseLock(currentUserId, now, officerProfileResponse, caseLock);
        caseLockRepository.save(caseLock);

        writeLockAudit(currentUserId, authentication, caseId, httpServletRequest, caseLock);
        return toResponse(caseLock, currentUserId, now);
    }

    @Transactional
    public CaseLockResponse renewLock(
            Long currentUserId,
            Authentication authentication,
            Long caseId
    ){
        LocalDateTime now = LocalDateTime.now();

        CaseReport caseReport = caseReportRepository.findById(caseId)
                .orElseThrow(() -> new AppException(ErrorCode.CASE_NOT_FOUND));

        officerPermissionService.validateCanViewCase(
                currentUserId,
                authentication,
                caseReport
        );

        CaseLock caseLock = caseLockRepository.findByCaseIdForUpdate(caseId)
                .orElseThrow(() -> new AppException(ErrorCode.LOCK_NOT_FOUD));

        if (!isActive(caseLock, now)){
            caseLock.setLockStatus(CaseLockStatus.EXPIRED);
            throw new AppException(ErrorCode.CASE_LOCK_EXPIRED);
        }

        if (!Objects.equals(caseLock.getLockedByUserId(), currentUserId)) {
            throw new AppException(ErrorCode.CASE_ALREADY_LOCKED);
        }

        caseLock.setExpiresAt(now.plusMinutes(ttlMinutes));
        caseLock.setLockStatus(CaseLockStatus.ACTIVE);
        caseLockRepository.save(caseLock);
        return toResponse(caseLock, currentUserId, now);
    }

    @Transactional
    public void releaseLock(
            Long currentUserId,
            Authentication authentication,
            Long caseId,
            HttpServletRequest httpServletRequest
    ){
        LocalDateTime now = LocalDateTime.now();

        CaseReport caseReport = caseReportRepository.findById(caseId)
                .orElseThrow(() -> new AppException(ErrorCode.CASE_NOT_FOUND));

        officerPermissionService.validateCanViewCase(
                currentUserId,
                authentication,
                caseReport
        );

        CaseLock caseLock = caseLockRepository.findByCaseIdForUpdate(caseId)
                .orElseThrow(() -> new AppException(ErrorCode.LOCK_NOT_FOUD));

        if (!Objects.equals(caseLock.getLockedByUserId(), currentUserId)){
            throw new AppException(ErrorCode.CASE_LOCK_OWNER_REQUIRED);
        }

        CaseLockStatus oldLockStatus = caseLock.getLockStatus();
        caseLock.setLockStatus(CaseLockStatus.RELEASED);
        caseLock.setReleasedAt(now);
        caseLock.setExpiresAt(now);

        auditLogService.writeLog(new AuditLogCommand(
                currentUserId,
                getRoleService.getFirstRole(authentication),
                AuditAction.CASE_UNLOCKED,
                AuditResourceType.CASE_REPORT,
                caseId,
                oldLockStatus.name(),
                CaseLockStatus.RELEASED.name(),
                "Officer released case lock",
                auditRequestMetadataResolver.getIpAddress(httpServletRequest),
                auditRequestMetadataResolver.getUserAgent(httpServletRequest),
                "officerId=" + caseLock.getLockedByOfficerId()
                        + ", releasedAt=" + now
        ));
    }

    @Transactional
    public CaseLockResponse getLockStatus(Long currentUserId, Authentication authentication, Long caseId) {
        LocalDateTime now = LocalDateTime.now();

        CaseReport caseReport = caseReportRepository.findById(caseId)
                .orElseThrow(() -> new AppException(ErrorCode.CASE_NOT_FOUND));

        officerPermissionService.validateCanViewCase(currentUserId, authentication, caseReport);

        return caseLockRepository.findByCaseId(caseId)
                .map(caseLock -> toResponse(caseLock, currentUserId, now))
                .orElse(null);
    }

    private void setCaseLock(Long currentUserId, LocalDateTime now, OfficerProfileResponse officerProfileResponse,
                             CaseLock caseLock) {
        caseLock.setLockedByUserId(currentUserId);
        caseLock.setLockedByOfficerId(officerProfileResponse.officerId());
        caseLock.setLockedByUnitId(officerProfileResponse.unitId());
        caseLock.setLockStatus(CaseLockStatus.ACTIVE);
        caseLock.setLockedAt(now);
        caseLock.setExpiresAt(now.plusMinutes(ttlMinutes));
        caseLock.setReleasedAt(null);
    }

    private void writeLockAudit(
            Long currentUserId,
            Authentication authentication,
            Long caseId,
            HttpServletRequest httpServletRequest,
            CaseLock caseLock
    ) {
        auditLogService.writeLog(new AuditLogCommand(
                currentUserId,
                getRoleService.getFirstRole(authentication),
                AuditAction.CASE_LOCKED,
                AuditResourceType.CASE_REPORT,
                caseId,
                null,
                CaseLockStatus.ACTIVE.name(),
                "Officer locked case",
                auditRequestMetadataResolver.getIpAddress(httpServletRequest),
                auditRequestMetadataResolver.getUserAgent(httpServletRequest),
                "officerId=" + caseLock.getLockedByOfficerId()
                        + ", unitId=" + caseLock.getLockedByUnitId()
                        + ", expiresAt=" + caseLock.getExpiresAt()
        ));
    }

    private boolean isActive(CaseLock caseLock, LocalDateTime now) {
        return caseLock.getLockStatus() == CaseLockStatus.ACTIVE
                && caseLock.getExpiresAt().isAfter(now);
    }

    private CaseLockResponse toResponse(
            CaseLock caseLock,
            Long currentUserId,
            LocalDateTime now
    ) {
        boolean active = isActive(caseLock, now);
        boolean lockedByMe = Objects.equals(caseLock.getLockedByUserId(), currentUserId);

        return new CaseLockResponse(
                caseLock.getCaseId(),
                caseLock.getLockedByUserId(),
                caseLock.getLockedByOfficerId(),
                caseLock.getLockedByUnitId(),
                caseLock.getLockStatus(),
                caseLock.getLockedAt(),
                caseLock.getExpiresAt(),
                lockedByMe,
                active
        );
    }

    @Transactional(readOnly = true)
    public void validateActiveLockOwnedByUser(Long currentUserId, Long caseId){
        LocalDateTime now = LocalDateTime.now();

        CaseLock caseLock = caseLockRepository.findByCaseId(caseId)
                .orElseThrow(() -> new AppException(ErrorCode.LOCK_NOT_FOUD));

        boolean isActive = isActive(caseLock, now);

        if (!isActive){
            throw new AppException(ErrorCode.CASE_LOCK_EXPIRED);
        }

        if (!Objects.equals(caseLock.getLockedByUserId(), currentUserId)){
            throw new AppException(ErrorCode.CASE_ALREADY_LOCKED);
        }
    }
}
