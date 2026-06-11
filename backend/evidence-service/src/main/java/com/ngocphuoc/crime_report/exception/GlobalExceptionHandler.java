package com.ngocphuoc.crime_report.exception;

import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    // Catch handling runtime exception
    @ExceptionHandler(value = Exception.class)
    ResponseEntity<ApiResponse<String>> handlingRuntimeException(Exception exception){
        ApiResponse<String> apiResponse = new ApiResponse<>();
        apiResponse.setCode(9999);
        apiResponse.setMessage(exception.getMessage());
        return ResponseEntity.badRequest().body(apiResponse);
    }
}
