package com.ngocphuoc.crime_report.shared.response;

import com.ngocphuoc.crime_report.shared.error.CommonErrorCode;
import com.ngocphuoc.crime_report.shared.error.ErrorCode;

public final class ErrorResponseFactory {
    private ErrorResponseFactory() {
    }

    public static <T> ApiResponse<T> from(ErrorCode errorCode) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(errorCode.getMessage())
                .errorCode(errorCode.getCode())
                .build();
    }

    public static <T> ApiResponse<T> internalServerError(String message) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message == null ? CommonErrorCode.INTERNAL_SERVER_ERROR.getMessage() : message)
                .errorCode(CommonErrorCode.INTERNAL_SERVER_ERROR.getCode())
                .build();
    }
}
