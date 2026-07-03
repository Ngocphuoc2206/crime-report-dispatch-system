package com.ngocphuoc.crime_report.report.dto.response;

public record ReporterInfoResponse(
        String fullName,
        String citizenId,
        String phone,
        String email,
        String address
) {
}
