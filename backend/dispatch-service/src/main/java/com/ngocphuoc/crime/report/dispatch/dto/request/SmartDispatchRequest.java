package com.ngocphuoc.crime.report.dispatch.dto.request;

public record SmartDispatchRequest(
        Long caseId,
        Double incidentLatitude,
        Double incidentLongitude,
        Boolean updateReportAssignment
) {
    public boolean shouldUpdateReportAssignment() {
        return updateReportAssignment == null || updateReportAssignment;
    }
}
