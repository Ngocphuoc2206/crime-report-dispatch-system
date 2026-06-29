package com.ngocphuoc.crime.report.dispatch.service;

import com.ngocphuoc.crime.report.dispatch.client.ReportAssignmentClient;
import com.ngocphuoc.crime.report.dispatch.dto.response.DispatchCandidateResponse;
import com.ngocphuoc.crime.report.dispatch.dto.response.DispatchTaskHistoryResponse;
import com.ngocphuoc.crime.report.dispatch.entity.DispatchTask;
import com.ngocphuoc.crime.report.dispatch.entity.DispatchTaskHistory;
import com.ngocphuoc.crime.report.dispatch.enums.DispatchStatus;
import com.ngocphuoc.crime.report.dispatch.repository.DispatchTaskHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DispatchTaskHistoryService {
    private final DispatchTaskHistoryRepository dispatchTaskHistoryRepository;
    private final ReportAssignmentClient reportAssignmentClient;

    @Transactional(readOnly = true)
    public List<DispatchTaskHistoryResponse> getHistory(int limit) {
        int size = Math.max(1, Math.min(limit, 100));

        return dispatchTaskHistoryRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(0, size))
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(propagation = Propagation.MANDATORY)
    public void record(
            DispatchTask task,
            String action,
            DispatchStatus previousStatus,
            DispatchStatus nextStatus,
            Long previousUnitId,
            Long previousOfficerId,
            String reason,
            String actor
    ) {
        DispatchTaskHistory history = new DispatchTaskHistory();
        history.setDispatchTask(task);
        history.setCaseId(task.getCaseId());
        history.setAction(action);
        history.setPreviousStatus(previousStatus == null ? null : previousStatus.name());
        history.setNextStatus(nextStatus == null ? null : nextStatus.name());
        history.setPreviousUnitId(previousUnitId);
        history.setPreviousOfficerId(previousOfficerId);
        history.setAssignedUnitId(task.getAssignedUnit() == null ? null : task.getAssignedUnit().getId());
        history.setAssignedOfficerId(task.getAssignedOfficer() == null ? null : task.getAssignedOfficer().getId());
        history.setReason(reason);
        history.setActor(actor == null ? "DISPATCH_SERVICE" : actor);

        dispatchTaskHistoryRepository.save(history);
    }

    private DispatchTaskHistoryResponse toResponse(DispatchTaskHistory history) {
        DispatchCandidateResponse report = reportAssignmentClient.getDispatchSummary(history.getCaseId());
        DispatchTask task = history.getDispatchTask();

        return new DispatchTaskHistoryResponse(
                history.getId(),
                task == null ? null : task.getId(),
                history.getCaseId(),
                report == null ? null : report.trackingCode(),
                report == null ? null : report.title(),
                report == null ? null : report.urgencyLevel(),
                history.getAction(),
                history.getPreviousStatus(),
                history.getNextStatus(),
                history.getPreviousUnitId(),
                history.getPreviousOfficerId(),
                history.getAssignedUnitId(),
                history.getAssignedOfficerId(),
                task == null || task.getAssignedUnit() == null ? null : task.getAssignedUnit().getName(),
                task == null || task.getAssignedOfficer() == null ? null : task.getAssignedOfficer().getBadgeNumber(),
                history.getReason(),
                history.getActor(),
                history.getCreatedAt()
        );
    }
}
