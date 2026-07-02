package com.ngocphuoc.crime_report.report.service;

import com.ngocphuoc.crime_report.common.ErrorCode;
import com.ngocphuoc.crime_report.enums.AuditAction;
import com.ngocphuoc.crime_report.enums.AuditResourceType;
import com.ngocphuoc.crime_report.report.client.dispatch.DispatchClient;
import com.ngocphuoc.crime_report.report.client.evidence.EvidenceClient;
import com.ngocphuoc.crime_report.report.client.urgency.UrgencyClient;
import com.ngocphuoc.crime_report.report.dto.request.CreateReportRequest;
import com.ngocphuoc.crime_report.report.dto.request.UrgencyScoreRequest;
import com.ngocphuoc.crime_report.report.dto.response.*;
import com.ngocphuoc.crime_report.report.entity.CaseReport;
import com.ngocphuoc.crime_report.crimecatalog.entity.CrimeType;
import com.ngocphuoc.crime_report.enums.CaseStatus;
import com.ngocphuoc.crime_report.enums.UrgencyLevel;
import com.ngocphuoc.crime_report.report.repository.CaseReportRepository;
import com.ngocphuoc.crime_report.crimecatalog.repository.CrimeTypeRepository;
import com.ngocphuoc.crime_report.identity.service.ReporterIdentityService;
import com.ngocphuoc.crime_report.shared.exception.AppException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CaseReportService {
    private final CaseReportRepository caseReportRepository;
    private final CrimeTypeRepository crimeTypeRepository;
    private final TrackingCodeGenerator trackingCodeGenerator;
    private final ReporterIdentityService reporterIdentityService;
    private final UrgencyClient urgencyClient;
    private final EvidenceClient evidenceClient;
    private final EvidenceFileInspector evidenceFileInspector;
    private final DispatchClient dispatchClient;
    private final AuditLogService auditLogService;
    private final AuditRequestMetadataResolver auditRequestMetadataResolver;
    private final SpamDetectionOrchestrator spamDetectionOrchestrator;

    @Transactional
    public CreateReportResponse createReport(
            CreateReportRequest request,
            List<MultipartFile> files,
            HttpServletRequest httpServletRequest
    ){
        List<MultipartFile> evidenceFiles = files == null ? List.of() : files;

        log.info("[INFO] Process creating report.....");
        log.info("[INFO] Size evidence files {}", evidenceFiles.size());
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
                        evidenceFileInspector.hasVideoEvidence(evidenceFiles)
                )
        );

        caseReport.setUrgencyScore(urgencyScoreResponse.score());
        caseReport.setUrgencyLevel(UrgencyLevel.valueOf(urgencyScoreResponse.level()));

        // Check report spam/fake
        SpamDetectionOrchestrator.FinalSpamDetectionResult spamResult =
                spamDetectionOrchestrator.analyze(request, crimeType);

        caseReport.setSpamScore(spamResult.spamScore());
        caseReport.setFakeScore(spamResult.fakeScore());
        caseReport.setAiConfidence(spamResult.aiConfidence());
        caseReport.setSpamLevel(spamResult.level());
        caseReport.setSpamReasons(String.join("; ", spamResult.reasons()));
        caseReport.setAiDecision(spamResult.decision());
        caseReport.setSpamDetectionSource(spamResult.aiModel() == null ? "RULE_BASED" : "HYBRID");
        caseReport.setAiModel(spamResult.aiModel());
        caseReport.setAiError(spamResult.aiError());
        caseReport.setAiCheckedAt(LocalDateTime.now());

        if ("BLOCK".equals(spamResult.recommendedAction())) {
            caseReport.setStatus(CaseStatus.SPAM_OR_FAKE);
        } else if ("MANUAL_REVIEW".equals(spamResult.recommendedAction())) {
            caseReport.setStatus(CaseStatus.UNDER_VERIFICATION);
        } else {
            caseReport.setStatus(CaseStatus.NEW_RECEIVED);
        }

        CaseReport saved = caseReportRepository.save(caseReport);

        // Write log calculate urgency
        auditLogService.writeLog(new AuditLogCommand(
                null,
                "PUBLIC",
                AuditAction.URGENCY_SCORE_CALCULATED,
                AuditResourceType.CASE_REPORT,
                saved.getId(),
                null,
                String.valueOf(saved.getUrgencyScore()),
                "Urgency score calculated for case report",
                auditRequestMetadataResolver.getIpAddress(httpServletRequest),
                auditRequestMetadataResolver.getUserAgent(httpServletRequest),
                "urgencyLevel=" + saved.getUrgencyLevel().name()
        ));

        // Write audit log AI detect
        auditLogService.writeLog(new AuditLogCommand(
                null,
                "SYSTEM",
                AuditAction.AI_SPAM_ANALYZED,
                AuditResourceType.CASE_REPORT,
                saved.getId(),
                null,
                saved.getSpamLevel(),
                "AI spam/fake analysis completed",
                auditRequestMetadataResolver.getIpAddress(httpServletRequest),
                auditRequestMetadataResolver.getUserAgent(httpServletRequest),
                "spamScore=" + saved.getSpamScore()
                        + ", spamLevel=" + saved.getSpamLevel()
                        + ", reasons=" + saved.getSpamReasons()
        ));

        // Save identity reporter
        reporterIdentityService.saveEncryptedReporterIdentity(saved, request, httpServletRequest);

        try{
            if (!evidenceFiles.isEmpty()) {
                evidenceClient.uploadEvidence(saved.getId(), saved.getTrackingCode(), evidenceFiles);
            }

            if ("AUTO_DISPATCH".equals(spamResult.recommendedAction())) {
                autoDispatchReport(saved, httpServletRequest);
            }

            auditLogService.writeLog(new AuditLogCommand(
                    null,
                    "PUBLIC",
                    AuditAction.CASE_CREATED,
                    AuditResourceType.CASE_REPORT,
                    saved.getId(),
                    null,
                    saved.getStatus().name(),
                    "Citizen created a new case report",
                    auditRequestMetadataResolver.getIpAddress(httpServletRequest),
                    auditRequestMetadataResolver.getUserAgent(httpServletRequest),
                    "trackingCode=" + saved.getTrackingCode()
            ));

        } catch (Exception e){
            log.error("[ERROR] Lỗi gọi dịch vụ ngoài (Dispatch/Evidence), kích hoạt Rollback dữ liệu. Chi tiết: ", e);
            throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR.getCode(),
                    "Không thể điều phối đơn vị hoặc tải bằng chứng: " + e.getMessage());
        }

        return new CreateReportResponse(
                saved.getId(),
                saved.getTrackingCode(),
                saved.getStatus().name(),
                saved.getUrgencyScore(),
                saved.getUrgencyLevel().name(),
                "Tin báo đã được tiếp nhận"
        );
    }

    private void autoDispatchReport(CaseReport saved, HttpServletRequest httpServletRequest) {
        try {
            SmartDispatchResponse dispatchResponse =
                    dispatchClient.smartDispatch(saved.getId(), saved.getLatitude(), saved.getLongitude());

            saved.setAssignedUnitId(dispatchResponse.assignedUnitId());
            saved.setAssignedOfficerId(dispatchResponse.assignedOfficerId());

            auditLogService.writeLog(new AuditLogCommand(
                    null,
                    "SYSTEM",
                    AuditAction.CASE_ASSIGNED,
                    AuditResourceType.CASE_REPORT,
                    saved.getId(),
                    null,
                    "unit=" + dispatchResponse.assignedUnitId() + ", officer=" + dispatchResponse.assignedOfficerId(),
                    "Case automatically assigned by smart dispatch",
                    auditRequestMetadataResolver.getIpAddress(httpServletRequest),
                    auditRequestMetadataResolver.getUserAgent(httpServletRequest),
                    "dispatchTaskId=" + dispatchResponse.dispatchTaskId()
            ));
        } catch (Exception e) {
            log.warn(
                    "[WARN] Auto dispatch failed for case {}, keeping it pending for manual handling",
                    saved.getId(),
                    e
            );
        }
    }

    @Transactional(readOnly = true)
    public List<DispatchCandidateResponse> getDispatchCandidates() {
        return caseReportRepository.findDispatchCandidates()
                .stream()
                .map(this::toDispatchCandidate)
                .toList();
    }

    @Transactional(readOnly = true)
    public DispatchCandidateResponse getDispatchSummary(Long caseId) {
        CaseReport c = caseReportRepository.findById(caseId)
                .orElseThrow(() -> new AppException(ErrorCode.CASE_NOT_FOUND));

        return toDispatchCandidate(c);
    }

    private DispatchCandidateResponse toDispatchCandidate(CaseReport c) {
        return new DispatchCandidateResponse(
                c.getId(),
                c.getTrackingCode(),
                c.getCrimeType().getName(),
                c.getDescription(),
                c.getCrimeType().getName(),
                c.getStatus().name(),
                c.getUrgencyLevel().name(),
                c.getLatitude(),
                c.getLongitude(),
                c.getAddressText(),
                c.getAssignedUnitId(),
                c.getAssignedOfficerId(),
                c.getSpamScore(),
                c.getSpamLevel(),
                c.getSpamReasons(),
                c.getFakeScore(),
                c.getAiConfidence(),
                c.getAiDecision(),
                c.getSpamDetectionSource(),
                c.getAiModel(),
                c.getAiCheckedAt(),
                c.getAiError(),
                c.getCreatedAt(),
                c.getUpdatedAt()
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

    @Transactional
    public void updateAssignment(
            Long caseId,
            Long assignedUnitId,
            Long assignedOfficerId,
            HttpServletRequest httpServletRequest
    ) {
        CaseReport caseReport = caseReportRepository.findById(caseId)
                .orElseThrow(() -> new AppException(ErrorCode.CASE_NOT_FOUND));

        auditLogService.writeLog(new AuditLogCommand(
                null,
                "INTERNAL_SERVICE",
                AuditAction.CASE_ASSIGNED,
                AuditResourceType.CASE_REPORT,
                caseReport.getId(),
                "unit=" + caseReport.getAssignedUnitId() + ", officer=" + caseReport.getAssignedOfficerId(),
                "unit=" + assignedUnitId + ", officer=" + assignedOfficerId,
                "Case assigned by smart dispatch service",
                auditRequestMetadataResolver.getIpAddress(httpServletRequest),
                auditRequestMetadataResolver.getUserAgent(httpServletRequest),
                "source=dispatch-service"
        ));

        caseReport.setAssignedUnitId(assignedUnitId);
        caseReport.setAssignedOfficerId(assignedOfficerId);
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
