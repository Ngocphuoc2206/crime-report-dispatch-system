package com.ngocphuoc.crime_report.urgency.dto.request;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

public record UrgencyRuleRequest(
        String ruleCode,
        Integer scoreValue,
        String description,
        Boolean isActive
) {
}
