package com.ngocphuoc.crime_report.report.service;

import com.ngocphuoc.crime_report.report.dto.response.OfficerAuditLogResponse;
import com.ngocphuoc.crime_report.report.entity.AuditLog;
import com.ngocphuoc.crime_report.report.entity.CaseReport;
import com.ngocphuoc.crime_report.report.repository.AuditLogRepository;
import com.ngocphuoc.crime_report.report.repository.CaseReportRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OfficerAuditLogQueryService {

    private static final String CASE_REPORT_RESOURCE_TYPE = "CASE_REPORT";

    private final AuditLogRepository auditLogRepository;
    private final CaseReportRepository caseReportRepository;

    public Page<OfficerAuditLogResponse> getAuditLogs(
            LocalDateTime from,
            LocalDateTime to,
            String action,
            String actorKeyword,
            String keyword,
            Pageable pageable
    ) {
        Page<AuditLog> logs = auditLogRepository.findAll(
                buildSpecification(from, to, action, actorKeyword, keyword),
                pageable
        );

        Map<Long, String> caseCodesById = getCaseCodesById(logs);

        return logs.map(log -> toResponse(log, caseCodesById.get(log.getResourceId())));
    }

    private Specification<AuditLog> buildSpecification(
            LocalDateTime from,
            LocalDateTime to,
            String action,
            String actorKeyword,
            String keyword
    ) {
        return (root, query, criteriaBuilder) -> {
            Predicate predicate = criteriaBuilder.conjunction();

            if (from != null) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.greaterThanOrEqualTo(root.get("createdAt"), from)
                );
            }

            if (to != null) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.lessThanOrEqualTo(root.get("createdAt"), to)
                );
            }

            if (hasText(action)) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.equal(root.get("action"), action.trim().toUpperCase(Locale.ROOT))
                );
            }

            if (hasText(actorKeyword)) {
                String pattern = likePattern(actorKeyword);
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.or(
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("actorRole")), pattern),
                                criteriaBuilder.like(root.get("actorUserId").as(String.class), pattern)
                        )
                );
            }

            if (hasText(keyword)) {
                String pattern = likePattern(keyword);
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.or(
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("action")), pattern),
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("resourceType")), pattern),
                                criteriaBuilder.like(root.get("resourceId").as(String.class), pattern),
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("note")), pattern),
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("ipAddress")), pattern),
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("detail")), pattern),
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("oldValue")), pattern),
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("newValue")), pattern),
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("actorRole")), pattern),
                                criteriaBuilder.like(root.get("actorUserId").as(String.class), pattern)
                        )
                );
            }

            return predicate;
        };
    }

    private Map<Long, String> getCaseCodesById(Page<AuditLog> logs) {
        Set<Long> caseIds = logs.getContent().stream()
                .filter(log -> CASE_REPORT_RESOURCE_TYPE.equals(log.getResourceType()))
                .map(AuditLog::getResourceId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        if (caseIds.isEmpty()) {
            return Map.of();
        }

        return caseReportRepository.findAllById(caseIds).stream()
                .collect(Collectors.toMap(CaseReport::getId, CaseReport::getTrackingCode));
    }

    private OfficerAuditLogResponse toResponse(AuditLog log, String resourceCode) {
        return new OfficerAuditLogResponse(
                log.getId(),
                log.getCreatedAt(),
                log.getActorUserId(),
                log.getActorRole(),
                log.getAction(),
                log.getResourceType(),
                log.getResourceId(),
                resourceCode,
                log.getOldValue(),
                log.getNewValue(),
                log.getNote(),
                log.getIpAddress(),
                log.getUserAgent(),
                log.getDetail()
        );
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    private String likePattern(String value) {
        return "%" + value.trim().toLowerCase(Locale.ROOT) + "%";
    }
}
