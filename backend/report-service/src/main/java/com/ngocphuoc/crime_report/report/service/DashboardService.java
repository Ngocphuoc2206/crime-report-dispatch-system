package com.ngocphuoc.crime_report.report.service;

import com.ngocphuoc.crime_report.enums.CaseStatus;
import com.ngocphuoc.crime_report.enums.UrgencyLevel;
import com.ngocphuoc.crime_report.report.dto.response.DashboardOverviewResponse;
import com.ngocphuoc.crime_report.report.repository.CaseReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final CaseReportRepository caseReportRepository;

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
}
