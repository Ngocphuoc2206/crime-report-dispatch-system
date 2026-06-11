package com.ngocphuoc.crime_report.common;

import lombok.Getter;

@Getter
public enum ErrorCode implements com.ngocphuoc.crime_report.shared.error.ErrorCode {
    // Case Report
    CRIME_NOT_FOUND("REPORT_1002", "Crime type not found"),
    CRIME_NOT_ACTIVE("REPORT_1003", "Crime type is not active"),
    TRACKING_CODE_NOT_FOUND("REPORT_1004", "Tracking code not found"),

    // AES-GCM
    AES_NOT_FOUND("REPORT_1005", "AES key must be 16, 24, or 32 bytes after Base64 decoding"),
    // Uncategorized
    UNCATEGORIZED_EXCEPTION("REPORT_9998", "UNCATEGORIZED_EXCEPTION!")
    ;
    ErrorCode(String code, String message){
        this.code = code;
        this.message = message;
    }

    private final String code;
    private final String message;
}
