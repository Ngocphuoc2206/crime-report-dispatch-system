package com.ngocphuoc.crime_report.report.service;

import com.ngocphuoc.crime_report.report.dto.request.CreateReportRequest;
import com.ngocphuoc.crime_report.report.dto.response.SpamDetectionResult;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

@Service
public class SpamDetectionService {
    private static final Pattern URL_PATTERN = Pattern.compile(
            "(https?://|www\\.|\\.com\\b|\\.vn\\b|bit\\.ly|zalo|telegram|facebook)",
            Pattern.CASE_INSENSITIVE
    );

    private static final Pattern REPEATED_CHARACTER_PATTERN = Pattern.compile("(.)\\1{7,}");

    public SpamDetectionResult analyze(CreateReportRequest request) {
        int score = 0;
        List<String> reasons = new ArrayList<>();

        String normalizedText = normalize(request.description()) + " " + normalize(request.addressText());

        if (normalizedText.contains("vay tien")) {
            score += 40;
            reasons.add("Contains loan advertising keyword");
        }

        if (normalizedText.contains("khuyen mai")) {
            score += 30;
            reasons.add("Contains promotional keyword");
        }

        if (normalizedText.contains("casino") || normalizedText.contains("ca cuoc")) {
            score += 50;
            reasons.add("Contains betting/casino keyword");
        }

        if (URL_PATTERN.matcher(normalizedText).find()) {
            score += 40;
            reasons.add("Contains external link or contact channel");
        }

        if (REPEATED_CHARACTER_PATTERN.matcher(normalizedText).find()) {
            score += 25;
            reasons.add("Contains repeated characters");
        }

        if (hasRepeatedWords(normalizedText)) {
            score += 25;
            reasons.add("Contains repeated words");
        }

        if (Boolean.TRUE.equals(request.isHappeningNow())) {
            score -= 20;
        }

        if (Boolean.TRUE.equals(request.hasWeapon())) {
            score -= 20;
        }

        if (Boolean.TRUE.equals(request.hasInjuredPerson())) {
            score -= 20;
        }

        score = Math.max(score, 0);
        score = Math.min(score, 100);

        return new SpamDetectionResult(score, resolveLevel(score), reasons);
    }

    private boolean hasRepeatedWords(String text) {
        String[] words = text.split("\\s+");
        int repeatedCount = 1;
        String previousWord = "";

        for (String word : words) {
            if (word.length() < 3) {
                repeatedCount = 1;
                previousWord = word;
                continue;
            }

            if (word.equals(previousWord)) {
                repeatedCount++;
                if (repeatedCount >= 4) {
                    return true;
                }
            } else {
                repeatedCount = 1;
            }

            previousWord = word;
        }

        return false;
    }

    private String normalize(String value) {
        if (value == null) {
            return "";
        }

        String withoutAccent = Normalizer.normalize(value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");

        return withoutAccent
                .replace('đ', 'd')
                .replace('Đ', 'D')
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9.\\s:/]", " ")
                .replaceAll("\\s+", " ")
                .trim();
    }

    private String resolveLevel(int score) {
        if (score >= 80) {
            return "HIGH";
        }

        if (score >= 50) {
            return "MEDIUM";
        }

        if (score >= 30) {
            return "LOW";
        }

        return "NONE";
    }
}
