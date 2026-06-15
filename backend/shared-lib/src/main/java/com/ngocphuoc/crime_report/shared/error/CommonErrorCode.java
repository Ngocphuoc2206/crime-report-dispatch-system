package com.ngocphuoc.crime_report.shared.error;

import lombok.Getter;

@Getter
public enum CommonErrorCode implements ErrorCode {
    UNAUTHORIZED("COMMON_401", "Unauthorized"),
    FORBIDDEN("COMMON_403", "Forbidden"),
    INTERNAL_SERVER_ERROR("COMMON_9999", "Internal server error");

    private final String code;
    private final String message;

    CommonErrorCode(String code, String message) {
        this.code = code;
        this.message = message;
    }
}
