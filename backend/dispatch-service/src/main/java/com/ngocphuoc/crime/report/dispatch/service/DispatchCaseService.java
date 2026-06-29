package com.ngocphuoc.crime.report.dispatch.service;

import com.ngocphuoc.crime.report.common.ErrorCode;
import com.ngocphuoc.crime.report.dispatch.client.ReportAssignmentClient;
import com.ngocphuoc.crime.report.dispatch.dto.response.DispatchCandidateResponse;
import com.ngocphuoc.crime.report.dispatch.dto.response.InternalReportLookupResponse;
import com.ngocphuoc.crime.report.dispatch.dto.response.PendingDispatchCaseResponse;
import com.ngocphuoc.crime.report.dispatch.dto.response.PoliceUnitDistanceResponse;
import com.ngocphuoc.crime_report.shared.exception.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DispatchCaseService {
    private final ReportAssignmentClient reportAssignmentClient;
    private final NearestPoliceUnitService nearestPoliceUnitService;

    public List<PendingDispatchCaseResponse> getPendingCases() {
        return reportAssignmentClient.getDispatchCandidates()
                .stream()
                .map(this::toPendingCase)
                .toList();
    }

    public PendingDispatchCaseResponse getCaseDetail(String trackingCode) {
        InternalReportLookupResponse lookup =
                reportAssignmentClient.getReportByTrackingCode(trackingCode);

        if (lookup == null || lookup.caseId() == null) {
            throw new AppException(ErrorCode.REPORT_NOT_DISPATCHABLE);
        }

        DispatchCandidateResponse summary =
                reportAssignmentClient.getDispatchSummary(lookup.caseId());

        if (summary == null) {
            throw new AppException(ErrorCode.REPORT_NOT_DISPATCHABLE);
        }

        return toPendingCase(summary);
    }

    DispatchCandidateResponse getDispatchSummaryByTrackingCode(String trackingCode) {
        InternalReportLookupResponse lookup =
                reportAssignmentClient.getReportByTrackingCode(trackingCode);

        if (lookup == null || lookup.caseId() == null) {
            throw new AppException(ErrorCode.REPORT_NOT_DISPATCHABLE);
        }

        DispatchCandidateResponse summary =
                reportAssignmentClient.getDispatchSummary(lookup.caseId());

        if (summary == null) {
            throw new AppException(ErrorCode.REPORT_NOT_DISPATCHABLE);
        }

        return summary;
    }

    private PendingDispatchCaseResponse toPendingCase(DispatchCandidateResponse item) {
        PoliceUnitDistanceResponse nearestUnit = findNearestUnit(item.latitude(), item.longitude());

        return new PendingDispatchCaseResponse(
                item.caseId(),
                item.trackingCode(),
                item.title(),
                item.crimeTypeName(),
                item.urgencyLevel(),
                item.status(),
                item.address(),
                item.latitude(),
                item.longitude(),
                item.description(),
                item.createdAt(),
                nearestUnit == null ? null : nearestUnit.unitName(),
                nearestUnit == null ? null : nearestUnit.distanceKm()
        );
    }

    private PoliceUnitDistanceResponse findNearestUnit(BigDecimal latitude, BigDecimal longitude) {
        if (latitude == null || longitude == null) {
            return null;
        }

        return nearestPoliceUnitService.findNearestPoliceUnit(
                latitude.doubleValue(),
                longitude.doubleValue()
        );
    }
}
