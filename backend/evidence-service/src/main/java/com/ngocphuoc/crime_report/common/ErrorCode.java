package com.ngocphuoc.crime_report.common;

import lombok.Getter;

@Getter
public enum ErrorCode implements com.ngocphuoc.crime_report.shared.error.ErrorCode {
    // EVIDENCE
    EVIDENCE_NOT_FOUND("EVIDENCE_1006", "Evidence not found"),
    EVIDENCE_TYPE_NOT_SUPPORTED(
            "EVIDENCE_1007",
            "Only image, video, or audio evidence files are supported"
    ),
    EVIDENCE_CASE_CLOSED(
            "EVIDENCE_1008",
            "Case has already been closed, evidence can no longer be updated"
    ),

    // Uncategorized
    UNCATEGORIZED_EXCEPTION("EVIDENCE_9998", "UNCATEGORIZED_EXCEPTION!")
    ;
    ErrorCode(String code, String message){
        this.code = code;
        this.message = message;
    }

    private final String code;
    private final String message;
}
