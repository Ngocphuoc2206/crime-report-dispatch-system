package com.ngocphuoc.crime_report.urgency.dto.response;

public record UrgencyRuleResponse(
        Long id,
        String ruleCode,
        Integer scoreValue,
        String description,
        Boolean isActive
) {
}
