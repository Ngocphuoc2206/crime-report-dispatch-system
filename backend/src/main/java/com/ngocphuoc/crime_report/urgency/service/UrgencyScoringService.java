package com.ngocphuoc.crime_report.urgency.service;

import com.ngocphuoc.crime_report.crimecatalog.entity.CrimeType;
import com.ngocphuoc.crime_report.enums.UrgencyLevel;
import com.ngocphuoc.crime_report.report.dto.request.CreateReportRequest;
import com.ngocphuoc.crime_report.urgency.dto.UrgencyScoreResult;
import com.ngocphuoc.crime_report.urgency.entity.UrgencyRule;
import com.ngocphuoc.crime_report.urgency.enums.UrgencyRuleCode;
import com.ngocphuoc.crime_report.urgency.repository.UrgencyRuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UrgencyScoringService {
    private final UrgencyRuleRepository urgencyRuleRepository;

    public UrgencyScoreResult calculate(
            CrimeType crimeType,
            CreateReportRequest request,
            List<MultipartFile> files
    ){
        int score = getBaseScore(crimeType);

        Map<String, UrgencyRule> activeRuleMap = getActiveRuleMap();

        if (Boolean.TRUE.equals(request.hasWeapon())) {
            score += getRuleScore(activeRuleMap, UrgencyRuleCode.HAS_WEAPON);
        }

        if (Boolean.TRUE.equals(request.isHappeningNow())) {
            score += getRuleScore(activeRuleMap, UrgencyRuleCode.HAPPENING_NOW);
        }

        if (Boolean.TRUE.equals(request.hasInjuredPerson())) {
            score += getRuleScore(activeRuleMap, UrgencyRuleCode.HAS_INJURED_PERSON);
        }

        if (hasVideoEvidence(files)) {
            score += getRuleScore(activeRuleMap, UrgencyRuleCode.EVIDENCE_TYPE_VIDEO);
        }

        return new UrgencyScoreResult(score, resolveUrgencyLevel(score));
    }

    private int getBaseScore(CrimeType crimeType){
        if (crimeType.getBaseScore() == null){
            return 0;
        }
        return crimeType.getBaseScore();
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

    private boolean hasVideoEvidence(List<MultipartFile> files) {
        if (files == null || files.isEmpty()) {
            return false;
        }

        return files.stream()
                .map(MultipartFile::getContentType)
                .anyMatch(contentType -> contentType != null && contentType.startsWith("video/"));
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
