package com.ngocphuoc.crime_report.report.service;

import com.ngocphuoc.crime_report.enums.CaseStatus;
import com.ngocphuoc.crime_report.enums.UrgencyLevel;
import com.ngocphuoc.crime_report.report.client.dispatch.DispatchClient;
import com.ngocphuoc.crime_report.report.dto.response.OfficerCaseResponse;
import com.ngocphuoc.crime_report.report.dto.response.OfficerProfileResponse;
import com.ngocphuoc.crime_report.report.entity.CaseReport;
import com.ngocphuoc.crime_report.report.repository.CaseReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OfficerCaseQueryService {
    private final CaseReportRepository caseReportRepository;
    private final DispatchClient dispatchOfficerClient;

    @Transactional(readOnly = true)
    public Page<OfficerCaseResponse> getOfficerCases(
            Long currentUserId,
            Authentication authentication,
            CaseStatus caseStatus,
            UrgencyLevel urgencyLevel,
            Pageable pageable
    ){
        boolean isAdmin = hasRole(authentication, "ROLE_ADMIN");
        boolean isCommander = hasRole(authentication, "ROLE_COMMANDER");

        if (isAdmin){
            return caseReportRepository.findAdminCases(caseStatus, urgencyLevel, pageable).map(this::toResponse);
        }

        OfficerProfileResponse officerProfileResponse = dispatchOfficerClient.getOfficerByUserId(currentUserId);
        if (isCommander){
            return caseReportRepository.findUnitCases(
                    officerProfileResponse.unitId(),
                    caseStatus,
                    urgencyLevel,
                    pageable
            ).map(this::toResponse);
        }

        return caseReportRepository.findOfficerVisibleCases(
                officerProfileResponse.officerId(),
                officerProfileResponse.unitId(),
                caseStatus,
                urgencyLevel,
                pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<OfficerCaseResponse> getMyCases(
            Long currentUserId,
            CaseStatus caseStatus,
            UrgencyLevel urgencyLevel,
            Pageable pageable
    ) {
        OfficerProfileResponse officerProfileResponse = dispatchOfficerClient.getOfficerByUserId(currentUserId);

        return caseReportRepository.findAssignedOfficerCases(
                officerProfileResponse.officerId(),
                caseStatus,
                urgencyLevel,
                pageable
        ).map(this::toResponse);
    }

    private OfficerCaseResponse toResponse(CaseReport caseReport) {
        return new OfficerCaseResponse(
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

    private boolean hasRole(Authentication authentication, String role){
        return authentication.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(role::equals);
    }
}
