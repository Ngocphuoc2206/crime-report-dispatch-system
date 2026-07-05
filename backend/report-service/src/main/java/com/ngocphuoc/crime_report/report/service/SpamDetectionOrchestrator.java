package com.ngocphuoc.crime_report.report.service;

import com.ngocphuoc.crime_report.crimecatalog.entity.CrimeType;
import com.ngocphuoc.crime_report.report.dto.request.CreateReportRequest;
import com.ngocphuoc.crime_report.report.dto.response.AiSpamDetectionResult;
import com.ngocphuoc.crime_report.report.dto.response.SpamDetectionResult;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SpamDetectionOrchestrator {

    private final SpamDetectionService ruleBasedSpamDetectionService;
    private final AiSpamDetectionClient aiSpamDetectionClient;

    public FinalSpamDetectionResult analyze(CreateReportRequest request, CrimeType crimeType) {
        SpamDetectionResult rule = ruleBasedSpamDetectionService.analyze(request);
        AiSpamDetectionResult ai = aiSpamDetectionClient.analyze(request, crimeType, rule);

        int finalSpamScore = Math.max(rule.score(), ai.spamScore());
        int finalFakeScore = ai.fakeScore();

        String finalLevel = resolveFinalLevel(finalSpamScore, finalFakeScore, ai.confidence());
        String finalDecision = resolveFinalDecision(finalLevel, ai.decision());
        String finalAction = resolveAction(request, finalLevel, finalDecision, ai.recommendedAction());

        List<String> reasons = new ArrayList<>();
        reasons.addAll(rule.reasons());
        reasons.addAll(ai.reasons());

        return new FinalSpamDetectionResult(
                finalSpamScore,
                finalFakeScore,
                ai.confidence(),
                finalLevel,
                finalDecision,
                finalAction,
                reasons,
                ai.model(),
                ai.error(),
                ai
        );
    }

    private String resolveFinalLevel(int spamScore, int fakeScore, int confidence) {
        int risk = Math.max(spamScore, fakeScore);

        if (spamScore >= 80) {
            return "HIGH";
        }

        if (fakeScore >= 80 && confidence >= 70) {
            return "HIGH";
        }

        if (risk >= 55) {
            return "MEDIUM";
        }

        if (risk >= 30) {
            return "LOW";
        }

        return "NONE";
    }

    private String resolveFinalDecision(String level, String aiDecision) {
        if ("HIGH".equals(level)) {
            return aiDecision;
        }

        if ("MEDIUM".equals(level)) {
            return "NEEDS_REVIEW";
        }

        return "LEGITIMATE";
    }

    private String resolveAction(
            CreateReportRequest request,
            String level,
            String decision,
            String aiRecommendedAction
    ) {
        boolean emergency =
                Boolean.TRUE.equals(request.isHappeningNow())
                        || Boolean.TRUE.equals(request.hasWeapon())
                        || Boolean.TRUE.equals(request.hasInjuredPerson());

        if ("HIGH".equals(level) && !emergency) {
            return "BLOCK";
        }

        if ("HIGH".equals(level)) {
            return "MANUAL_REVIEW";
        }

        if ("MEDIUM".equals(level)) {
            return "MANUAL_REVIEW";
        }

        return "AUTO_DISPATCH";
    }

    public record FinalSpamDetectionResult(
            int spamScore,
            int fakeScore,
            int aiConfidence,
            String level,
            String decision,
            String recommendedAction,
            List<String> reasons,
            String aiModel,
            String aiError,
            AiSpamDetectionResult aiResult
    ) {
    }
}
