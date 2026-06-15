package com.ngocphuoc.crime_report.common;

import lombok.Getter;

@Getter
public enum ErrorCode implements com.ngocphuoc.crime_report.shared.error.ErrorCode {
    // Login
    USER_NOT_FOUND("AUTH_1001", "User not found"),

    // Uncategorized
    UNCATEGORIZED_EXCEPTION("AUTH_9998", "UNCATEGORIZED_EXCEPTION!")
    ;
    ErrorCode(String code, String message){
        this.code = code;
        this.message = message;
    }

    private final String code;
    private final String message;
}
