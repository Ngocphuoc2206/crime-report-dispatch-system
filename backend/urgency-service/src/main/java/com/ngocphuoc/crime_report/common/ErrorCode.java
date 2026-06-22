package com.ngocphuoc.crime_report.common;

import lombok.Getter;

@Getter
public enum ErrorCode implements com.ngocphuoc.crime_report.shared.error.ErrorCode {
    // Urgency Rule
    URGENCY_RULE_NOT_FOUND("URGENCY_1001", "Urgency not found"),
    RULE_CODE_ALREADY_USED("URGENCY_1002", "UrgencyRule code has already used"),
    // Uncategorized
    UNCATEGORIZED_EXCEPTION("URGENCY_9998", "UNCATEGORIZED_EXCEPTION!")
    ;
    ErrorCode(String code, String message){
        this.code = code;
        this.message = message;
    }

    private final String code;
    private final String message;
}
