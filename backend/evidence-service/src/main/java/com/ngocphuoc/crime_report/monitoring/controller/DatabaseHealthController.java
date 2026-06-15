package com.ngocphuoc.crime_report.monitoring.controller;

import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Objects;

@RestController
public class DatabaseHealthController {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseHealthController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/api/health/db")
    public ApiResponse<Map<String, Object>> databaseHealth() {
        Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);

        return ApiResponse.<Map<String, Object>>builder().data(Map.of(
                "status", "OK",
                "database", "MariaDB",
                "result", Objects.requireNonNull(result)
        )).build();
    }
}
