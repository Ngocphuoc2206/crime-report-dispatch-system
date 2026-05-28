package com.ngocphuoc.crime_report.controller;

import com.ngocphuoc.crime_report.common.ApiResponse;
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

        return ApiResponse.<Map<String, Object>>builder().results(Map.of(
                "status", "OK",
                "database", "PostgreSQL",
                "result", Objects.requireNonNull(result)
        )).build();
    }
}
