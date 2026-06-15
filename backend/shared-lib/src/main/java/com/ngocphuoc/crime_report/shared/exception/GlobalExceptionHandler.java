package com.ngocphuoc.crime_report.shared.exception;

import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import com.ngocphuoc.crime_report.shared.response.ErrorResponseFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse<String>> handlingAppException(AppException exception) {
        return ResponseEntity.badRequest().body(ErrorResponseFactory.from(exception.getErrorCode()));
    }

    @ExceptionHandler(value = Exception.class)
    ResponseEntity<ApiResponse<String>> handlingRuntimeException(Exception exception) {
        return ResponseEntity.badRequest().body(ErrorResponseFactory.internalServerError(exception.getMessage()));
    }
}
