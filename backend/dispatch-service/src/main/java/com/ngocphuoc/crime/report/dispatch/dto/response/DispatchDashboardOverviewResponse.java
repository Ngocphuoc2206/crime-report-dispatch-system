package com.ngocphuoc.crime.report.dispatch.dto.response;

public record DispatchDashboardOverviewResponse(
        long waitingCases,
        long assignedTasks,
        long availableOfficers,
        long busyOfficers,
        long criticalCases,
        long completedTasks
) {
}
