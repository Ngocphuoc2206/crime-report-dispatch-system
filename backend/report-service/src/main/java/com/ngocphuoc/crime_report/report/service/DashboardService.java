package com.ngocphuoc.crime_report.report.service;

import com.ngocphuoc.crime_report.common.ErrorCode;
import com.ngocphuoc.crime_report.enums.CaseStatus;
import com.ngocphuoc.crime_report.enums.UrgencyLevel;
import com.ngocphuoc.crime_report.report.dto.response.DashboardOverviewResponse;
import com.ngocphuoc.crime_report.report.dto.response.CrimeAnalyticsResponse;
import com.ngocphuoc.crime_report.report.dto.response.HeatmapPointResponse;
import com.ngocphuoc.crime_report.report.dto.response.MonthlyReportTrendResponse;
import com.ngocphuoc.crime_report.report.dto.response.TimelineEventResponse;
import com.ngocphuoc.crime_report.report.repository.AuditLogRepository;
import com.ngocphuoc.crime_report.report.repository.CaseReportRepository;
import com.ngocphuoc.crime_report.shared.exception.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private static final int DEFAULT_ANALYTICS_MONTHS = 6;
    private static final int MIN_ANALYTICS_MONTHS = 3;
    private static final int MAX_ANALYTICS_MONTHS = 12;
    private static final DateTimeFormatter MONTH_LABEL_FORMATTER =
            DateTimeFormatter.ofPattern("'T' M/yyyy", Locale.forLanguageTag("vi-VN"));

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

    @Transactional(readOnly = true)
    public CrimeAnalyticsResponse getAnalytics(Integer months) {
        int resolvedMonths = months == null ? DEFAULT_ANALYTICS_MONTHS : months;
        if (resolvedMonths < MIN_ANALYTICS_MONTHS || resolvedMonths > MAX_ANALYTICS_MONTHS) {
            throw new IllegalArgumentException("Analytics months must be between 3 and 12");
        }

        YearMonth lastCompletedMonth = YearMonth.from(LocalDate.now()).minusMonths(1);
        YearMonth firstMonth = lastCompletedMonth.minusMonths(resolvedMonths - 1L);
        List<Long> counts = new ArrayList<>(resolvedMonths);
        List<MonthlyReportTrendResponse> trend = new ArrayList<>(resolvedMonths + 1);

        for (int index = 0; index < resolvedMonths; index++) {
            YearMonth month = firstMonth.plusMonths(index);
            long count = caseReportRepository.countByCreatedAtGreaterThanEqualAndCreatedAtLessThan(
                    month.atDay(1).atStartOfDay(),
                    month.plusMonths(1).atDay(1).atStartOfDay()
            );
            counts.add(count);
            trend.add(toTrendPoint(month, count, false));
        }

        long forecast = forecastNextMonth(counts);
        YearMonth forecastMonth = lastCompletedMonth.plusMonths(1);
        trend.add(toTrendPoint(forecastMonth, forecast, true));

        long previousCount = counts.get(counts.size() - 2);
        long latestCount = counts.getLast();
        Double changePercent = previousCount == 0
                ? null
                : Math.round(((latestCount - previousCount) * 10000.0 / previousCount)) / 100.0;

        return new CrimeAnalyticsResponse(
                trend,
                changePercent,
                trendDirection(latestCount, previousCount),
                forecast,
                "LINEAR_REGRESSION"
        );
    }

    private MonthlyReportTrendResponse toTrendPoint(
            YearMonth month,
            long count,
            boolean forecast
    ) {
        return new MonthlyReportTrendResponse(
                month.getYear(),
                month.getMonthValue(),
                month.format(MONTH_LABEL_FORMATTER),
                count,
                forecast
        );
    }

    static long forecastNextMonth(List<Long> counts) {
        int size = counts.size();
        double xMean = (size - 1) / 2.0;
        double yMean = counts.stream().mapToLong(Long::longValue).average().orElse(0);
        double numerator = 0;
        double denominator = 0;

        for (int index = 0; index < size; index++) {
            double xDifference = index - xMean;
            numerator += xDifference * (counts.get(index) - yMean);
            denominator += xDifference * xDifference;
        }

        double slope = denominator == 0 ? 0 : numerator / denominator;
        double intercept = yMean - slope * xMean;
        return Math.max(0, Math.round(intercept + slope * size));
    }

    private String trendDirection(long latest, long previous) {
        if (latest > previous) {
            return "UP";
        }
        if (latest < previous) {
            return "DOWN";
        }
        return "STABLE";
    }
}
