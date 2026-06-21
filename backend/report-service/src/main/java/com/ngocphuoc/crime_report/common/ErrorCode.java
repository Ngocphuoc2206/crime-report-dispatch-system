package com.ngocphuoc.crime_report.common;

import lombok.Getter;

import java.util.function.Supplier;

@Getter
public enum ErrorCode implements com.ngocphuoc.crime_report.shared.error.ErrorCode {
    // Case Report
    CRIME_NOT_FOUND("REPORT_1002", "Crime type not found"),
    CRIME_NOT_ACTIVE("REPORT_1003", "Crime type is not active"),
    TRACKING_CODE_NOT_FOUND("REPORT_1004", "Tracking code not found"),
    CASE_NOT_FOUND("REPORT_1005", "Case report not found"),
    REPORTER_NOT_FOUND("REPORT_1006", "Reporter not found"),
    ACCESS_DENIED("REPORT_1007", "Access is denied"),
    // AES-GCM
    AES_NOT_FOUND("REPORT_1008", "AES key must be 16, 24, or 32 bytes after Base64 decoding"),
    //CASE LOCK
    CASE_ALREADY_LOCKED("REPORT_1009", "Case is already locked by another officer"),
    CASE_LOCK_EXPIRED("REPORT_1010", "Case lock has expired"),
    LOCK_NOT_FOUD("REPORT_1011", "Case lock not found"),
    CASE_LOCK_OWNER_REQUIRED("REPORT_1012", "Only lock owner can release or renew this lock"),
    CASE_STATUS_NOT_ACCEPTABLE("REPORT_1013", "Case status is not acceptable for this action"),
    INVALID_CASE_STATUS_TRANSITION("REPORT_1014", "Invalid case status transition"),
    ROLE_NOT_ALLOWED_FOR_TRANSITION("REPORT_1015", "Current role is not allowed for this status transition"),
    // Uncategorized
    UNCATEGORIZED_EXCEPTION("REPORT_9998", "UNCATEGORIZED_EXCEPTION!"),
    INTERNAL_SERVER_ERROR("REPORT_INTERNAL_SERVER", "Server is not response");
    ErrorCode(String code, String message){
        this.code = code;
        this.message = message;
    }

    private final String code;
    private final String message;
}
