package com.ngocphuoc.crime_report.report.service;

import com.ngocphuoc.crime_report.common.ErrorCode;
import com.ngocphuoc.crime_report.identity.entity.ReporterIdentity;
import com.ngocphuoc.crime_report.identity.repository.ReporterIdentityRepository;
import com.ngocphuoc.crime_report.report.client.dispatch.DispatchClient;
import com.ngocphuoc.crime_report.report.client.evidence.EvidenceClient;
import com.ngocphuoc.crime_report.report.dto.response.EvidenceMetadataResponse;
import com.ngocphuoc.crime_report.report.dto.response.OfficerCaseDetailResponse;
import com.ngocphuoc.crime_report.report.dto.response.OfficerCaseResponse;
import com.ngocphuoc.crime_report.report.dto.response.OfficerProfileResponse;
import com.ngocphuoc.crime_report.report.entity.CaseReport;
import com.ngocphuoc.crime_report.report.repository.CaseReportRepository;
import com.ngocphuoc.crime_report.shared.exception.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class OfficerCaseDetailService {
    private final CaseReportRepository caseReportRepository;
    private final DispatchClient dispatchClient;
    private final EvidenceClient evidenceClient;
    private final ReporterIdentityRepository reporterIdentityRepository;

    @Transactional(readOnly = true)
    public OfficerCaseDetailResponse getCaseDetail(
            Long currentUserId,
            Authentication authentication,
            Long caseId
    ){
        CaseReport caseReport = caseReportRepository.findById(caseId)
                .orElseThrow(() -> new AppException(ErrorCode.CASE_NOT_FOUND));

        validateScope(currentUserId, authentication, caseReport);

        List<EvidenceMetadataResponse> evidences =
                evidenceClient.getEvidenceMetadataByCaseId(caseReport.getId());

        return toResponse(caseReport, evidences);
    }

    private void validateScope(Long currentUserId, Authentication authentication, CaseReport caseReport) {
        if (hasRole(authentication, "ROLE_ADMIN")){
            return;
        }

        OfficerProfileResponse officerProfile = dispatchClient.getOfficerByUserId(currentUserId);

        if (hasRole(authentication, "ROLE_COMMANDER")){
            boolean sameUnit = Objects.equals(
                    caseReport.getAssignedUnitId(),
                    officerProfile.unitId()
            );

            if (!sameUnit){
                throw new AppException(ErrorCode.ACCESS_DENIED);
            }

            return;
        }

        boolean assignedToOfficer = Objects.equals(
                caseReport.getAssignedOfficerId(),
                officerProfile.officerId()
        );

        boolean sameUnit = Objects.equals(
                caseReport.getAssignedUnitId(),
                officerProfile.unitId()
        );

        if (!assignedToOfficer && !sameUnit){
            throw new AppException(ErrorCode.ACCESS_DENIED);
        }
    }

    private boolean hasRole(Authentication authentication, String role){
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(role::equals);
    }

    private OfficerCaseDetailResponse toResponse(
            CaseReport caseReport,
            List<EvidenceMetadataResponse> evidences
    ){
        boolean isAnonymous = true;
        ReporterIdentity reporterIdentity = reporterIdentityRepository.findByCaseReportId(caseReport.getId())
                .orElseThrow(() -> new AppException(ErrorCode.REPORTER_NOT_FOUND));

        if (reporterIdentity.getEncryptedFullName() == null){
            isAnonymous = false;
        }

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

                caseReport.getCreatedAt(),
                caseReport.getUpdatedAt(),

                evidences
        );
    }

}
