package com.ngocphuoc.crime.report.dispatch.service;

import com.ngocphuoc.crime.report.dispatch.client.ReportAssignmentClient;
import com.ngocphuoc.crime.report.dispatch.dto.response.DispatchActivityResponse;
import com.ngocphuoc.crime.report.dispatch.dto.response.DispatchCandidateResponse;
import com.ngocphuoc.crime.report.dispatch.dto.response.DispatchDashboardOverviewResponse;
import com.ngocphuoc.crime.report.dispatch.dto.response.PendingDispatchCaseResponse;
import com.ngocphuoc.crime.report.dispatch.entity.DispatchTask;
import com.ngocphuoc.crime.report.dispatch.enums.AvailabilityStatus;
import com.ngocphuoc.crime.report.dispatch.enums.DispatchStatus;
import com.ngocphuoc.crime.report.dispatch.repository.DispatchTaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DispatchDashboardService {
    private final DispatchCaseService dispatchCaseService;
    private final DispatchTaskRepository dispatchTaskRepository;
    private final DutyAvailabilityService dutyAvailabilityService;
    private final ReportAssignmentClient reportAssignmentClient;

    public DispatchDashboardOverviewResponse getOverview() {
        List<PendingDispatchCaseResponse> waitingCases = dispatchCaseService.getPendingCases();
        long assignedTasks = dispatchTaskRepository
                .findByDispatchStatusInOrderByCreatedAtDesc(List.of(DispatchStatus.ASSIGNED, DispatchStatus.PENDING))
                .size();
        long completedTasks = dispatchTaskRepository
                .findByDispatchStatusInOrderByCreatedAtDesc(List.of(DispatchStatus.COMPLETED))
                .size();
        long availableOfficers = dutyAvailabilityService
                .getCurrentAssignmentsByStatus(AvailabilityStatus.AVAILABLE)
                .size();
        long busyOfficers = dutyAvailabilityService
                .getCurrentAssignmentsByStatus(AvailabilityStatus.BUSY)
                .size();
        long criticalCases = waitingCases.stream()
                .filter(item -> "CRITICAL".equals(item.urgencyLevel()))
                .count();

        return new DispatchDashboardOverviewResponse(
                waitingCases.size(),
                assignedTasks,
                availableOfficers,
                busyOfficers,
                criticalCases,
                completedTasks
        );
    }

    public List<PendingDispatchCaseResponse> getPriorityQueue() {
        return dispatchCaseService.getPendingCases();
    }

    public List<DispatchActivityResponse> getActivity(int limit) {
        return dispatchTaskRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .limit(Math.max(1, limit))
                .map(this::toActivity)
                .toList();
    }

    private DispatchActivityResponse toActivity(DispatchTask task) {
        DispatchCandidateResponse report = reportAssignmentClient.getDispatchSummary(task.getCaseId());

        return new DispatchActivityResponse(
                task.getId(),
                task.getCaseId(),
                report == null ? null : report.trackingCode(),
                task.getDispatchStatus().name(),
                "Dispatch task " + task.getDispatchStatus().name(),
                report == null ? null : report.urgencyLevel(),
                task.getCreatedAt()
        );
    }
}
