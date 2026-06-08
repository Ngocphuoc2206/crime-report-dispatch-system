package com.ngocphuoc.crime_report.report.service;

import com.ngocphuoc.crime_report.report.repository.CaseReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.Year;
import java.util.concurrent.ThreadLocalRandom;

@Component
@RequiredArgsConstructor
public class TrackingCodeGenerator {
    private final CaseReportRepository caseReportRepository;

    // Case ex: TB-2026-928331
    public String generate(){
        String trackingCode;
        do {
            int year = Year.now().getValue();
            int randomNumber = ThreadLocalRandom.current().nextInt(1, 1_000_000);
            trackingCode = "TB-" + year + "-" + String.format("%06d", randomNumber);
        } while (caseReportRepository.existsByTrackingCode(trackingCode));

        return trackingCode;
    }
}
