package com.ngocphuoc.crime_report.identity.service;

import com.ngocphuoc.crime_report.enums.AuditAction;
import com.ngocphuoc.crime_report.enums.AuditResourceType;
import com.ngocphuoc.crime_report.identity.dto.EncryptionResult;
import com.ngocphuoc.crime_report.report.dto.request.CreateReportRequest;
import com.ngocphuoc.crime_report.report.dto.response.AuditLogCommand;
import com.ngocphuoc.crime_report.report.entity.CaseReport;
import com.ngocphuoc.crime_report.identity.entity.ReporterIdentity;
import com.ngocphuoc.crime_report.identity.repository.ReporterIdentityRepository;
import com.ngocphuoc.crime_report.report.service.AuditLogService;
import com.ngocphuoc.crime_report.report.service.AuditRequestMetadataResolver;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReporterIdentityService {
    private final ReporterIdentityRepository reporterIdentityRepository;
    private final EncryptionService encryptionService;
    private final ObjectMapper objectMapper;
    private final AuditLogService auditLogService;
    private final AuditRequestMetadataResolver auditRequestMetadataResolver;

    public void saveEncryptedReporterIdentity(
            CaseReport caseReport,
            CreateReportRequest request,
            HttpServletRequest httpServletRequest
    ){
        log.info("[INFO] Process save encrypt reporter identity...");
        // Check user is anonymous
        if (!hasReporterInfo(request)){
            return;
        }

        String reporterJson = toReporterJson(request);
        EncryptionResult encryptionResult = encryptionService.encrypt(reporterJson);

        ReporterIdentity reporterIdentity = new ReporterIdentity();
        reporterIdentity.setCaseReport(caseReport);
        // Store encrypted reporter JSON payload in encrypted_full_name.
        // Other encrypted fields remain null.
        reporterIdentity.setEncryptedFullName(encryptionResult.cipherText());
        reporterIdentity.setEncryptedPhone(null);
        reporterIdentity.setEncryptedEmail(null);
        reporterIdentity.setEncryptedAddress(null);

        reporterIdentity.setIv(encryptionResult.iv());
        reporterIdentity.setEncryptionKeyVersion(encryptionResult.keyVersion());

        ReporterIdentity savedIdentity = reporterIdentityRepository.save(reporterIdentity);

        auditLogService.writeLog(new AuditLogCommand(
                null,
                "PUBLIC",
                AuditAction.REPORTER_IDENTITY_ENCRYPTED,
                AuditResourceType.REPORTER_IDENTITY,
                savedIdentity.getId(),
                null,
                null,
                "Reporter identity was encrypted and stored",
                auditRequestMetadataResolver.getIpAddress(httpServletRequest),
                auditRequestMetadataResolver.getUserAgent(httpServletRequest),
                "caseId=" + caseReport.getId()
                        + ", fields=reporterName,reporterCitizenId,reporterPhone,reporterEmail,reporterAddress"
        ));
    }

    private String toReporterJson(CreateReportRequest request){
        Map<String, String> payload = Map.of(
                "fullName", valueOrEmpty(request.reporterFullName()),
                "citizenId", valueOrEmpty(request.reporterCitizenId()),
                "phone", valueOrEmpty(request.reporterPhone()),
                "email", valueOrEmpty(request.reporterEmail()),
                "address", valueOrEmpty(request.reporterAddress())
        );
        log.info("[INFO] Prepared reporter identity payload for encryption");
        return objectMapper.writeValueAsString(payload);
    }

    private boolean hasReporterInfo(CreateReportRequest request) {
        return hasText(request.reporterFullName())
                || hasText(request.reporterCitizenId())
                || hasText(request.reporterPhone())
                || hasText(request.reporterEmail())
                || hasText(request.reporterAddress());
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    private String valueOrEmpty(String value) {
        return value == null ? "" : value.trim();
    }
}
