package com.ngocphuoc.crime_report.report.service;

import com.ngocphuoc.crime_report.report.dto.request.CreateReportRequest;
import com.ngocphuoc.crime_report.report.dto.response.SpamDetectionResult;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class SpamDetectionServiceTest {
    private final SpamDetectionService spamDetectionService = new SpamDetectionService();

    @Test
    void shouldDetectSpamReport(){
        // Arrange
        CreateReportRequest request = request(
                "Khuyến mãi vay tiền nhanh click www.vaynhanh.com nhận tiền ngay",
                false,
                false,
                false
        );

        //Act
        SpamDetectionResult spamDetectionResult = spamDetectionService.analyze(request);

        // Assert
        Assertions.assertEquals("HIGH", spamDetectionResult.level());
        Assertions.assertTrue(spamDetectionResult.score() >= 80);
    }

    @Test
    void shouldKeepEmergencyReportAsNotSpam(){
        // Arrange
        CreateReportRequest request = request(
                "Có người đang cầm dao, đang uy hiếp một người khác, có người bị thương",
                true,
                true,
                true
        );

        // Act
        SpamDetectionResult spamDetectionResult = spamDetectionService.analyze(request);

        // Assert
        Assertions.assertEquals("NONE", spamDetectionResult.level());
        Assertions.assertEquals(0, spamDetectionResult.score());
    }

    private CreateReportRequest request(
            String description,
            boolean isHappeningNow,
            boolean hasWeapon,
            boolean hasInjuredPerson)
    {
        return new CreateReportRequest(
                1L,
                description,
                LocalDateTime.now(),
                false,
                false,
                false,
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
