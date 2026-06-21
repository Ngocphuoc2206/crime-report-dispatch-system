package com.ngocphuoc.crime_report.report.dto.request;

import com.ngocphuoc.crime_report.enums.CaseStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateCaseStatusRequest(
//        {
//  "status": "RESOLVED",
//  "note": "Đã xác minh và xử lý xong tin báo"
//}
        @NotNull
        CaseStatus caseStatus,

        @Size(max = 500)
        String note
) {
}
