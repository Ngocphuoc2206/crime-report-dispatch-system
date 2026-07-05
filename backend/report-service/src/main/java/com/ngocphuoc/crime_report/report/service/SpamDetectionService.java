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
            "(https?://|www\\.|\\.(com|net|org|vn|io|me)\\b|bit\\.ly|zalo|telegram|facebook)",
            Pattern.CASE_INSENSITIVE
    );

    private static final Pattern BETTING_PATTERN = Pattern.compile(
            "\\b([a-z0-9-]*bet[a-z0-9-]*|casino|nha cai|ca cuoc|ca do|keo nha cai|tai xiu|xoc dia|slot|jackpot)\\b",
            Pattern.CASE_INSENSITIVE
    );

    private static final Pattern PROMOTION_PATTERN = Pattern.compile(
            "\\b(khuyen mai|promo|bonus|nap tien|rut tien|nhan tien|vay tien)\\b",
            Pattern.CASE_INSENSITIVE
    );

    private static final Pattern REPEATED_CHARACTER_PATTERN = Pattern.compile("(.)\\1{7,}");

    public SpamDetectionResult analyze(CreateReportRequest request) {
        int score = 0;
        List<String> reasons = new ArrayList<>();

        String normalizedText = normalize(request.description()) + " " + normalize(request.addressText());
        boolean hasBettingSignal = BETTING_PATTERN.matcher(normalizedText).find();
        boolean hasPromotionSignal = PROMOTION_PATTERN.matcher(normalizedText).find();
        boolean hasExternalLink = URL_PATTERN.matcher(normalizedText).find();

        if (hasBettingSignal) {
            score += 60;
            reasons.add("Contains betting/casino keyword or domain");
        }

        if (hasPromotionSignal) {
            score += 30;
            reasons.add("Contains promotional or money keyword");
        }

        if (hasExternalLink) {
            score += 40;
            reasons.add("Contains external link or contact channel");
        }

        if (hasBettingSignal && hasExternalLink) {
            score += 20;
            reasons.add("Betting content includes external link");
        }

        if (hasPromotionSignal && hasExternalLink) {
            score += 20;
            reasons.add("Promotional content includes external link");
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
                .replaceAll("[^a-z0-9.\\s:/-]", " ")
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
