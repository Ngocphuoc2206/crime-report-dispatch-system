package com.ngocphuoc.crime_report.report.service;

import com.ngocphuoc.crime_report.common.ErrorCode;
import com.ngocphuoc.crime_report.enums.CaseStatus;
import com.ngocphuoc.crime_report.enums.UrgencyLevel;
import com.ngocphuoc.crime_report.report.dto.response.HeatmapPointResponse;
import com.ngocphuoc.crime_report.report.repository.CaseReportRepository;
import com.ngocphuoc.crime_report.shared.exception.AppException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock
    private CaseReportRepository caseReportRepository;

    @InjectMocks
    private DashboardService dashboardService;

    @Test
    void getHeatmap_shouldReturnPoints_whenFiltersAreValid() {
        LocalDateTime from = LocalDateTime.of(2026, 6, 1, 0, 0);
        LocalDateTime to = LocalDateTime.of(2026, 6, 30, 23, 59);

        HeatmapPointResponse point = new HeatmapPointResponse(
                1L,
                new BigDecimal("10.7769000"),
                new BigDecimal("106.7009000"),
                UrgencyLevel.CRITICAL,
                "Cướp giật",
                CaseStatus.NEW_RECEIVED,
                LocalDateTime.of(2026, 6, 15, 10, 0)
        );

        List<HeatmapPointResponse> expected = List.of(point);

        when(caseReportRepository.findHeatMapPoints(
                from,
                to,
                UrgencyLevel.CRITICAL
        )).thenReturn(expected);

        List<HeatmapPointResponse> actual = dashboardService.getHeatmap(
                from,
                to,
                UrgencyLevel.CRITICAL
        );

        assertEquals(expected, actual);
        assertEquals(1, actual.size());
        assertEquals(UrgencyLevel.CRITICAL, actual.getFirst().urgencyLevel());

        verify(caseReportRepository).findHeatMapPoints(
                from,
                to,
                UrgencyLevel.CRITICAL
        );
    }

    @Test
    void getHeatmap_shouldAllowNullFilters() {
        when(caseReportRepository.findHeatMapPoints(null, null, null))
                .thenReturn(List.of());

        List<HeatmapPointResponse> result =
                dashboardService.getHeatmap(null, null, null);

        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(caseReportRepository)
                .findHeatMapPoints(null, null, null);
    }

    @Test
    void getHeatmap_shouldThrowException_whenFromIsAfterTo() {
        LocalDateTime from = LocalDateTime.of(2026, 6, 30, 0, 0);
        LocalDateTime to = LocalDateTime.of(2026, 6, 1, 0, 0);

        AppException exception = assertThrows(
                AppException.class,
                () -> dashboardService.getHeatmap(
                        from,
                        to,
                        UrgencyLevel.HIGH
                )
        );

        assertEquals(
                ErrorCode.INVALID_TIME_RANGE,
                exception.getErrorCode()
        );

        verifyNoInteractions(caseReportRepository);
    }

    @Test
    void getHeatmap_shouldAllowEqualFromAndTo() {
        LocalDateTime time = LocalDateTime.of(2026, 6, 15, 10, 0);

        when(caseReportRepository.findHeatMapPoints(
                time,
                time,
                UrgencyLevel.MEDIUM
        )).thenReturn(List.of());

        assertDoesNotThrow(() ->
                dashboardService.getHeatmap(
                        time,
                        time,
                        UrgencyLevel.MEDIUM
                )
        );

        verify(caseReportRepository).findHeatMapPoints(
                time,
                time,
                UrgencyLevel.MEDIUM
        );
    }
}