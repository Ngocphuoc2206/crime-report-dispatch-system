package com.ngocphuoc.crime_report.common;

import lombok.Getter;

@Getter
public enum ErrorCode implements com.ngocphuoc.crime_report.shared.error.ErrorCode {
    // Login
    USER_NOT_FOUND("AUTH_1001", "User not found"),
    USER_ALREADY_EXISTS("AUTH_1002", "Username already exists"),
    EMAIL_ALREADY_EXISTS("AUTH_1003", "Email already exists"),
    ROLE_NOT_FOUND("AUTH_1004", "One or more roles do not exist"),
    USER_CANNOT_DEACTIVATE_SELF("AUTH_1005", "Admin cannot deactivate itself"),

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
