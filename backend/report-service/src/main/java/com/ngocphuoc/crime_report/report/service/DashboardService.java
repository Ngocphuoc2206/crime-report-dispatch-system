package com.ngocphuoc.crime_report.report.service;

import com.ngocphuoc.crime_report.common.ErrorCode;
import com.ngocphuoc.crime_report.enums.CaseStatus;
import com.ngocphuoc.crime_report.enums.UrgencyLevel;
import com.ngocphuoc.crime_report.report.dto.response.DashboardOverviewResponse;
import com.ngocphuoc.crime_report.report.dto.response.HeatmapPointResponse;
import com.ngocphuoc.crime_report.report.dto.response.TimelineEventResponse;
import com.ngocphuoc.crime_report.report.repository.AuditLogRepository;
import com.ngocphuoc.crime_report.report.repository.CaseReportRepository;
import com.ngocphuoc.crime_report.shared.exception.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final CaseReportRepository caseReportRepository;
    private final AuditLogRepository auditLogRepository;

    @Transactional(readOnly = true)
    public DashboardOverviewResponse getOverview(){
        return new DashboardOverviewResponse(
                caseReportRepository.count(),

                caseReportRepository.countByStatus(
                        CaseStatus.NEW_RECEIVED
                ),
                caseReportRepository.countByStatus(
                        CaseStatus.UNDER_VERIFICATION
                ),
                caseReportRepository.countByStatus(
                        CaseStatus.TRANSFERRED_TO_INVESTIGATION
                ),
                caseReportRepository.countByStatus(
                        CaseStatus.RESOLVED
                ),
                caseReportRepository.countByStatus(
                        CaseStatus.SPAM_OR_FAKE
                ),

                caseReportRepository.countByUrgencyLevel(
                        UrgencyLevel.CRITICAL
                ),
                caseReportRepository.countByUrgencyLevel(
                        UrgencyLevel.HIGH
                ),
                caseReportRepository.countByUrgencyLevel(
                        UrgencyLevel.MEDIUM
                ),
                caseReportRepository.countByUrgencyLevel(
                        UrgencyLevel.LOW
                )
        );
    }

    @Transactional(readOnly = true)
    public List<HeatmapPointResponse> getHeatmap(
            LocalDateTime from,
            LocalDateTime to,
            UrgencyLevel urgencyLevel
    ) {
        if (from != null && to != null && from.isAfter(to)) {
            throw new AppException(ErrorCode.INVALID_TIME_RANGE);
        }

        return caseReportRepository.findHeatMapPoints(
                from,
                to,
                urgencyLevel
        );
    }

    @Transactional(readOnly = true)
    public List<TimelineEventResponse> getTimeline(Integer limit) {
        int resolvedLimit = limit == null ? 20 : limit;

        if (resolvedLimit < 1 || resolvedLimit > 100) {
            throw new AppException(ErrorCode.INVALID_TIMELINE_LIMIT);
        }

        return auditLogRepository.findLatestTimeline(
                PageRequest.of(0, resolvedLimit)
        );
    }
}
