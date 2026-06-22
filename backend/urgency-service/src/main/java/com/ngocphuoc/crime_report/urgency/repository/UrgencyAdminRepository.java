package com.ngocphuoc.crime_report.urgency.repository;

import com.ngocphuoc.crime_report.urgency.entity.UrgencyRule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UrgencyAdminRepository extends JpaRepository<UrgencyRule, Long> {
    Optional<UrgencyRule> findByRuleCode(String ruleCode);

    boolean existsByRuleCode(String ruleCode);
}
