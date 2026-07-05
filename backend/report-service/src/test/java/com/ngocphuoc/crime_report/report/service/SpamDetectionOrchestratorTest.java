package com.ngocphuoc.crime_report.report.service;

import com.ngocphuoc.crime_report.crimecatalog.entity.CrimeType;
import com.ngocphuoc.crime_report.report.dto.request.CreateReportRequest;
import com.ngocphuoc.crime_report.report.dto.response.AiSpamDetectionResult;
import com.ngocphuoc.crime_report.report.dto.response.SpamDetectionResult;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SpamDetectionOrchestratorTest {

    @Mock
    private SpamDetectionService ruleBasedSpamDetectionService;

    @Mock
    private AiSpamDetectionClient aiSpamDetectionClient;

    @InjectMocks
    private SpamDetectionOrchestrator spamDetectionOrchestrator;

    @Test
    void analyze_shouldKeepHighRuleResult_whenAiFallsBack() {
        CreateReportRequest request = request(
                "Nhà cái 8xbet đến từ châu Âu: https://8xbetpromo.com/",
                false,
                false,
                false
        );
        CrimeType crimeType = new CrimeType();
        crimeType.setName("Gây rối trật tự công cộng");

        SpamDetectionResult ruleResult = new SpamDetectionResult(
                100,
                "HIGH",
                List.of("Contains betting/casino keyword or domain")
        );
        AiSpamDetectionResult aiFallback =
                AiSpamDetectionResult.fallback("AI spam detection is disabled");

        when(ruleBasedSpamDetectionService.analyze(request))
                .thenReturn(ruleResult);
        when(aiSpamDetectionClient.analyze(request, crimeType, ruleResult))
                .thenReturn(aiFallback);

        SpamDetectionOrchestrator.FinalSpamDetectionResult result =
                spamDetectionOrchestrator.analyze(request, crimeType);

        assertEquals(100, result.spamScore());
        assertEquals("HIGH", result.level());
        assertEquals("BLOCK", result.recommendedAction());
    }

    @Test
    void analyze_shouldSendEmergencyHighRiskToManualReview() {
        CreateReportRequest request = request(
                "Có người bị thương nhưng nội dung có link ngoài đáng ngờ",
                true,
                false,
                true
        );
        CrimeType crimeType = new CrimeType();
        crimeType.setName("Cướp giật");

        SpamDetectionResult ruleResult = new SpamDetectionResult(
                90,
                "HIGH",
                List.of("Contains external link or contact channel")
        );
        AiSpamDetectionResult aiFallback =
                AiSpamDetectionResult.fallback("AI spam detection is disabled");

        when(ruleBasedSpamDetectionService.analyze(request))
                .thenReturn(ruleResult);
        when(aiSpamDetectionClient.analyze(request, crimeType, ruleResult))
                .thenReturn(aiFallback);

        SpamDetectionOrchestrator.FinalSpamDetectionResult result =
                spamDetectionOrchestrator.analyze(request, crimeType);

        assertEquals("HIGH", result.level());
        assertEquals("MANUAL_REVIEW", result.recommendedAction());
    }

    private CreateReportRequest request(
            String description,
            boolean isHappeningNow,
            boolean hasWeapon,
            boolean hasInjuredPerson
    ) {
        return new CreateReportRequest(
                1L,
                description,
                LocalDateTime.now(),
                isHappeningNow,
                hasWeapon,
                hasInjuredPerson,
                BigDecimal.valueOf(10.776889),
                BigDecimal.valueOf(106.700806),
                "Phường Bến Nghé, Quận 1, TP.HCM",
                "Nguyen Van A",
                "079000000000",
                "0900000000",
                "a@example.com",
                "TP.HCM"
        );
    }
}
