package com.ngocphuoc.crime_report.service;

import com.ngocphuoc.crime_report.common.ErrorCode;
import com.ngocphuoc.crime_report.dto.request.CreateReportRequest;
import com.ngocphuoc.crime_report.dto.response.CreateReportResponse;
import com.ngocphuoc.crime_report.entity.CaseReport;
import com.ngocphuoc.crime_report.entity.CrimeType;
import com.ngocphuoc.crime_report.enums.CaseStatus;
import com.ngocphuoc.crime_report.enums.UrgencyLevel;
import com.ngocphuoc.crime_report.exception.AppException;
import com.ngocphuoc.crime_report.repository.CaseReportRepository;
import com.ngocphuoc.crime_report.repository.CrimeTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CaseReportService {
    private final CaseReportRepository caseReportRepository;
    private final CrimeTypeRepository crimeTypeRepository;
    private final TrackingCodeGenerator trackingCodeGenerator;

    @Transactional
    public CreateReportResponse createReport(CreateReportRequest request){
        CrimeType crimeType = crimeTypeRepository.findById(request.crimeTypeId())
                .orElseThrow(() -> new AppException(ErrorCode.CRIME_NOT_FOUND));

        if (!Boolean.TRUE.equals(crimeType.getIsActive())){
            throw new AppException(ErrorCode.CRIME_NOT_ACTIVE);
        }

        CaseReport caseReport = new CaseReport();

        caseReport.setTrackingCode(trackingCodeGenerator.generate());
        caseReport.setCrimeType(crimeType);
        caseReport.setDescription(request.description());
        caseReport.setIncidentTime(request.incidentTime());
        caseReport.setIsHappeningNow(request.isHappeningNow());
        caseReport.setHasWeapon(request.hasWeapon());
        caseReport.setHasInjuredPerson(request.hasInjuredPerson());
        caseReport.setLatitude(request.latitude());
        caseReport.setLongitude(request.longitude());
        caseReport.setAddressText(request.addressText());

        caseReport.setStatus(CaseStatus.NEW_RECEIVED);

        int baseScore = crimeType.getBaseScore() != null ? crimeType.getBaseScore() : 0;
        caseReport.setUrgencyScore(baseScore);
        caseReport.setUrgencyLevel(resolveUrgencyLevel(baseScore));

        CaseReport saved = caseReportRepository.save(caseReport);

        return new CreateReportResponse(
                saved.getId(),
                saved.getTrackingCode(),
                saved.getStatus().name(),
                saved.getUrgencyScore(),
                saved.getUrgencyLevel().name(),
                "Tin báo đã được tiếp nhận"
        );
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
