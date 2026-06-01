package com.ngocphuoc.crime_report.common;

import lombok.Getter;

@Getter
public enum ErrorCode {
    // Login
    USER_NOT_FOUND(1001, "User not found"),
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
