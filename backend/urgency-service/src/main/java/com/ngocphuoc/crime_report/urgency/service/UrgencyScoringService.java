package com.ngocphuoc.crime_report.urgency.service;

import com.ngocphuoc.crime_report.enums.UrgencyLevel;
import com.ngocphuoc.crime_report.urgency.dto.response.UrgencyScoreResult;
import com.ngocphuoc.crime_report.urgency.entity.UrgencyRule;
import com.ngocphuoc.crime_report.urgency.enums.UrgencyRuleCode;
import com.ngocphuoc.crime_report.urgency.repository.UrgencyRuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UrgencyScoringService {
    private final UrgencyRuleRepository urgencyRuleRepository;

    public UrgencyScoreResult calculate(
            Integer baseScore,
            Boolean hasWeapon,
            Boolean isHappeningNow,
            Boolean hasInjuredPerson,
            Boolean hasVideoEvidence
    ){
        int score = getBaseScore(baseScore);

        Map<String, UrgencyRule> activeRuleMap = getActiveRuleMap();

        if (Boolean.TRUE.equals(hasWeapon)) {
            score += getRuleScore(activeRuleMap, UrgencyRuleCode.HAS_WEAPON);
        }

        if (Boolean.TRUE.equals(isHappeningNow)) {
            score += getRuleScore(activeRuleMap, UrgencyRuleCode.HAPPENING_NOW);
        }

        if (Boolean.TRUE.equals(hasInjuredPerson)) {
            score += getRuleScore(activeRuleMap, UrgencyRuleCode.HAS_INJURED_PERSON);
        }

        if (Boolean.TRUE.equals(hasVideoEvidence)) {
            score += getRuleScore(activeRuleMap, UrgencyRuleCode.EVIDENCE_TYPE_VIDEO);
        }

        return new UrgencyScoreResult(score, resolveUrgencyLevel(score));
    }

    private int getBaseScore(Integer baseScore){
        if (baseScore == null){
            return 0;
        }
        return baseScore;
    }

    private Map<String, UrgencyRule> getActiveRuleMap(){
        return urgencyRuleRepository.findAllByIsActiveTrue().stream()
                .collect(Collectors.toMap(UrgencyRule::getRuleCode, Function.identity()));
    }

    private int getRuleScore(Map<String, UrgencyRule> activeRuleMap, UrgencyRuleCode code) {
        UrgencyRule rule = activeRuleMap.get(code.name());
        if (rule == null || rule.getScoreValue() == null) {
            return 0;
        }
        return rule.getScoreValue();
    }

    private UrgencyLevel resolveUrgencyLevel(int score) {
        if (score > 80) {
            return UrgencyLevel.CRITICAL;
        }

        if (score >= 61) {
            return UrgencyLevel.HIGH;
        }

        if (score >= 31) {
            return UrgencyLevel.MEDIUM;
        }

        return UrgencyLevel.LOW;
    }
}
