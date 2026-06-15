package com.ngocphuoc.crime.report.dispatch.dto.request;

public record SmartDispatchRequest(
        Long caseId,
        Double incidentLatitude,
        Double incidentLongitude
) {
}
