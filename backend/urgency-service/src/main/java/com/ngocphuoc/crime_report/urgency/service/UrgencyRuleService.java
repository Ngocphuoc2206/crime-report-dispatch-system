package com.ngocphuoc.crime_report.urgency.service;

import com.ngocphuoc.crime_report.common.ErrorCode;
import com.ngocphuoc.crime_report.urgency.entity.UrgencyRule;
import com.ngocphuoc.crime_report.urgency.enums.UrgencyRuleCode;
import com.ngocphuoc.crime_report.urgency.repository.UrgencyRuleRepository;
import com.ngocphuoc.crime_report.shared.exception.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UrgencyRuleService {
    private final UrgencyRuleRepository urgencyRuleRepository;

    public Integer getScore(UrgencyRuleCode code){
        UrgencyRule urgencyRule = urgencyRuleRepository.findByRuleCode(code.name())
                .orElseThrow(() -> new AppException(ErrorCode.URGENCY_RULE_NOT_FOUND));

        return urgencyRule.getScoreValue();
    }
}
