package com.ngocphuoc.crime_report.urgency.dto.request;

public record UrgencyRuleUpdateRequest(
        Long id,
        String ruleCode,
        Integer scoreValue,
        String description,
        Boolean isActive
) {
}
