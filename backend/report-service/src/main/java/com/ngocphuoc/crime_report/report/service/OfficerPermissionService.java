package com.ngocphuoc.crime_report.report.service;

import com.ngocphuoc.crime_report.common.ErrorCode;
import com.ngocphuoc.crime_report.report.client.dispatch.DispatchClient;
import com.ngocphuoc.crime_report.report.dto.response.OfficerProfileResponse;
import com.ngocphuoc.crime_report.report.entity.CaseReport;
import com.ngocphuoc.crime_report.shared.exception.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class OfficerPermissionService {
    private final DispatchClient dispatchClient;

    public void validateCanViewCase(
            Long currentUserId,
            Authentication authentication,
            CaseReport caseReport
    ){
        // Admin
        if (hasRole(authentication, "ROLE_ADMIN")){
            return;
        }

        // get information officer
        OfficerProfileResponse officerProfileResponse = dispatchClient.getOfficerByUserId(currentUserId);

        // Commander
        if (hasRole(authentication, "ROLE_COMMANDER")){
            boolean sameUnit = Objects.equals(
                    caseReport.getAssignedUnitId(),
                    officerProfileResponse.unitId()
            );

            if (!sameUnit){
                throw new AppException(ErrorCode.ACCESS_DENIED.getCode(),
                        "Access denied: Commander can only view cases within their unit.");
            }
             return;
        }

        // Officer
        boolean ísAssignedToOfficer = Objects.equals(
                caseReport.getAssignedOfficerId(),
                officerProfileResponse.officerId()
        );

        if (!ísAssignedToOfficer){
            throw new AppException(ErrorCode.ACCESS_DENIED.getCode(),
                    "Access denied: Officer can only view their assigned cases.");
        }
    }

    private boolean hasRole(Authentication authentication, String roleCommander) {
        return authentication.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(roleCommander::equals);
    }
}
