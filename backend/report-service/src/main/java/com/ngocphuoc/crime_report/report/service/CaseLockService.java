package com.ngocphuoc.crime_report.report.service;

import com.ngocphuoc.crime_report.common.ErrorCode;
import com.ngocphuoc.crime_report.enums.CaseLockStatus;
import com.ngocphuoc.crime_report.report.client.dispatch.DispatchClient;
import com.ngocphuoc.crime_report.report.dto.response.CaseLockResponse;
import com.ngocphuoc.crime_report.report.dto.response.OfficerProfileResponse;
import com.ngocphuoc.crime_report.report.entity.CaseLock;
import com.ngocphuoc.crime_report.report.entity.CaseReport;
import com.ngocphuoc.crime_report.report.repository.CaseLockRepository;
import com.ngocphuoc.crime_report.report.repository.CaseReportRepository;
import com.ngocphuoc.crime_report.shared.exception.AppException;
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

    @Value("${app.case-lock.ttl-minutes}")
    private long ttlMinutes;

    @Transactional
    public CaseLockResponse acquireLock(
            Long currentUserId,
            Authentication authentication,
            Long caseId
    ){
        LocalDateTime now = LocalDateTime.now();

        // Get information officer
        OfficerProfileResponse officerProfileResponse = dispatchClient.getOfficerByUserId(currentUserId);

        //Get case reportById
        CaseReport caseReport = caseReportRepository.findByIdForUpdate(caseId)
                .orElseThrow(() -> new AppException(ErrorCode.CASE_NOT_FOUND));

        // Check role has permission view this case
        officerPermissionService.validateCanViewCase(currentUserId, authentication, caseReport);

        CaseLock caseLock = caseLockRepository.findByCaseIdForUpdate(caseId).orElse(null);

        if (caseLock == null) {
            CaseLock newLock = new CaseLock();
            newLock.setCaseId(caseId);
            setCaseLock(currentUserId, now, officerProfileResponse, newLock);

            return toResponse(caseLockRepository.save(newLock), currentUserId, now);
        }

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

        if (!Objects.equals(caseLock.getLockedByUserId(), currentUserId)){
            throw new AppException(ErrorCode.CASE_LOCK_OWNER_REQUIRED);
        }

        caseLock.setLockStatus(CaseLockStatus.RELEASED);
        caseLock.setReleasedAt(now);
        caseLock.setExpiresAt(now);
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

    private void setCaseLock(Long currentUserId, LocalDateTime now, OfficerProfileResponse officerProfileResponse, CaseLock caseLock) {
        caseLock.setLockedByUserId(currentUserId);
        caseLock.setLockedByOfficerId(officerProfileResponse.officerId());
        caseLock.setLockedByUnitId(officerProfileResponse.unitId());
        caseLock.setLockStatus(CaseLockStatus.ACTIVE);
        caseLock.setLockedAt(now);
        caseLock.setExpiresAt(now.plusMinutes(ttlMinutes));
        caseLock.setReleasedAt(null);
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
}
