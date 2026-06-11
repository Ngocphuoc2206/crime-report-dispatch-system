package com.ngocphuoc.crime_report.report.service;

import com.ngocphuoc.crime_report.common.ErrorCode;
import com.ngocphuoc.crime_report.report.client.evidence.EvidenceClient;
import com.ngocphuoc.crime_report.report.client.urgency.UrgencyClient;
import com.ngocphuoc.crime_report.report.dto.request.CreateReportRequest;
import com.ngocphuoc.crime_report.report.dto.request.UrgencyScoreRequest;
import com.ngocphuoc.crime_report.report.dto.response.CreateReportResponse;
import com.ngocphuoc.crime_report.report.dto.response.InternalReportLookupResponse;
import com.ngocphuoc.crime_report.report.dto.response.ReportStatusResponse;
import com.ngocphuoc.crime_report.report.dto.response.UrgencyScoreResponse;
import com.ngocphuoc.crime_report.report.entity.CaseReport;
import com.ngocphuoc.crime_report.crimecatalog.entity.CrimeType;
import com.ngocphuoc.crime_report.enums.CaseStatus;
import com.ngocphuoc.crime_report.enums.UrgencyLevel;
import com.ngocphuoc.crime_report.report.repository.CaseReportRepository;
import com.ngocphuoc.crime_report.crimecatalog.repository.CrimeTypeRepository;
import com.ngocphuoc.crime_report.identity.service.ReporterIdentityService;
import com.ngocphuoc.crime_report.shared.exception.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CaseReportService {
    private final CaseReportRepository caseReportRepository;
    private final CrimeTypeRepository crimeTypeRepository;
    private final TrackingCodeGenerator trackingCodeGenerator;
    private final ReporterIdentityService reporterIdentityService;
    private final UrgencyClient urgencyClient;
    private final EvidenceClient evidenceClient;
    private final EvidenceFileInspector evidenceFileInspector;

    @Transactional
    public CreateReportResponse createReport(CreateReportRequest request, List<MultipartFile> files){
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

        // Calculate follow request
        UrgencyScoreResponse urgencyScoreResponse = urgencyClient.calculateScore(
                new UrgencyScoreRequest(
                        crimeType.getBaseScore() == null ? 0 : crimeType.getBaseScore(),
                        request.hasWeapon(),
                        request.isHappeningNow(),
                        request.hasInjuredPerson(),
                        evidenceFileInspector.hasVideoEvidence(files)
                )
        );

        caseReport.setUrgencyScore(urgencyScoreResponse.score());
        caseReport.setUrgencyLevel(UrgencyLevel.valueOf(urgencyScoreResponse.level()));

        CaseReport saved = caseReportRepository.save(caseReport);
        reporterIdentityService.saveEncryptedReporterIdentity(saved, request);

        // Add file evidence
        evidenceClient.uploadEvidence(saved.getTrackingCode(), files);

        return new CreateReportResponse(
                saved.getId(),
                saved.getTrackingCode(),
                saved.getStatus().name(),
                saved.getUrgencyScore(),
                saved.getUrgencyLevel().name(),
                "Tin báo đã được tiếp nhận"
        );
    }

    // Get internal report
    @Transactional(readOnly = true)
    public InternalReportLookupResponse getInternalReportByTrackingCode(String trackingCode){
        CaseReport caseReport = caseReportRepository.findByTrackingCode(trackingCode)
                .orElseThrow(() -> new IllegalArgumentException("Tracking code not found"));

        return new InternalReportLookupResponse(
                caseReport.getId(),
                caseReport.getTrackingCode(),
                caseReport.getStatus().name()
        );
    }

    @Transactional(readOnly = true)
    public ReportStatusResponse getPublicReportStatus(String trackingCode){
        CaseReport caseReport = caseReportRepository.findByTrackingCode(trackingCode)
                .orElseThrow(() -> new AppException(ErrorCode.TRACKING_CODE_NOT_FOUND));

        return new ReportStatusResponse(
                caseReport.getTrackingCode(),
                caseReport.getStatus().name(),
                toPublicDisplayStatus(caseReport.getStatus()),
                caseReport.getCreatedAt()
        );
    }

    private String toPublicDisplayStatus(CaseStatus status) {
        return switch (status){
            case NEW_RECEIVED -> "Tin báo đã được tiếp nhận";
            case UNDER_VERIFICATION -> "Tin báo đang được xác minh";
            case TRANSFERRED_TO_INVESTIGATION -> "Tin báo đã được chuyển xử lý";
            case RESOLVED -> "Tin báo đã được xử lý";
            case SPAM_OR_FAKE -> "Tin báo đã được kiểm tra";
        };
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
