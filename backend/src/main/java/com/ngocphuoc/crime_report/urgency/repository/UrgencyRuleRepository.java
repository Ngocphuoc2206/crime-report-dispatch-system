package com.ngocphuoc.crime_report.urgency.repository;

import com.ngocphuoc.crime_report.urgency.entity.UrgencyRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UrgencyRuleRepository
        extends JpaRepository<UrgencyRule, Long> {

    Optional<UrgencyRule> findByRuleCode(String ruleCode);
}
