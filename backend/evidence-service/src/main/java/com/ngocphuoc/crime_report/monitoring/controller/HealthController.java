package com.ngocphuoc.crime_report.monitoring.controller;

import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
public class HealthController {
    @GetMapping("/api/health")
    public ApiResponse<Map<String, Object>> health(){
        return ApiResponse.<Map<String, Object>>builder()
                .data(Map.of(
                        "status", "OK",
                        "service", "evidence-service",
                        "timeStamp", LocalDateTime.now().toString()
                ))
                .build();
    }
}
