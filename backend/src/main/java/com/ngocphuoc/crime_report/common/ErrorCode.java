package com.ngocphuoc.crime_report.common;

import lombok.Getter;

@Getter
public enum ErrorCode {
    // Login
    USER_NOT_FOUND(1001, "User not found"),

    // Case Report
    CRIME_NOT_FOUND(1002, "Crime type not found"),
    CRIME_NOT_ACTIVE(1003, "Crime type is not active"),
    TRACKING_CODE_NOT_FOUND(1004, "Tracking code not found"),

    // AES-GCM
    AES_NOT_FOUND(1005, "AES key must be 16, 24, or 32 bytes after Base64 decoding"),

    // EVIDENCE
    EVIDENCE_NOT_FOUND(1006, "Evidence not found"),
    // Uncategorized
    UNCATEGORIZED_EXCEPTION  (9998, "UNCATEGORIZED_EXCEPTION!")
    ;
    ErrorCode(int code, String message){
        this.code = code;
        this.message = message;
    }

    private final int code;
    private final String message;
}
