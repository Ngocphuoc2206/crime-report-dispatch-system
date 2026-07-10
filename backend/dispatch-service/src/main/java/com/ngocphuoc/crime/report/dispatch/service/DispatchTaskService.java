package com.ngocphuoc.crime.report.dispatch.service;

import com.ngocphuoc.crime.report.common.ErrorCode;
import com.ngocphuoc.crime.report.dispatch.client.ReportAssignmentClient;
import com.ngocphuoc.crime.report.dispatch.dto.request.DispatchByTrackingCodeRequest;
import com.ngocphuoc.crime.report.dispatch.dto.request.ReassignDispatchTaskRequest;
import com.ngocphuoc.crime.report.dispatch.dto.request.UpdateDispatchTaskStatusRequest;
import com.ngocphuoc.crime.report.dispatch.dto.response.AssignedDispatchTaskResponse;
import com.ngocphuoc.crime.report.dispatch.dto.response.DispatchCandidateResponse;
import com.ngocphuoc.crime.report.dispatch.dto.response.PoliceUnitDistanceResponse;
import com.ngocphuoc.crime.report.dispatch.dto.response.SmartDispatchResponse;
import com.ngocphuoc.crime.report.dispatch.entity.DispatchTask;
import com.ngocphuoc.crime.report.dispatch.entity.DutyAssignment;
import com.ngocphuoc.crime.report.dispatch.enums.AvailabilityStatus;
import com.ngocphuoc.crime.report.dispatch.enums.DispatchStatus;
import com.ngocphuoc.crime.report.dispatch.enums.DutyShiftStatus;
import com.ngocphuoc.crime.report.dispatch.repository.DispatchTaskRepository;
import com.ngocphuoc.crime.report.dispatch.repository.DutyAssignmentRepository;
import com.ngocphuoc.crime_report.shared.exception.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class DispatchTaskService {
    private final DispatchTaskRepository dispatchTaskRepository;
    private final DutyAssignmentRepository dutyAssignmentRepository;
    private final SmartDispatchService smartDispatchService;
    private final DispatchCaseService dispatchCaseService;
    private final ReportAssignmentClient reportAssignmentClient;
    private final NearestPoliceUnitService nearestPoliceUnitService;
    private final DispatchTaskHistoryService dispatchTaskHistoryService;

    @Transactional(readOnly = true)
    public List<AssignedDispatchTaskResponse> getTasks() {
        return dispatchTaskRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AssignedDispatchTaskResponse getTask(Long taskId) {
        return toResponse(findTask(taskId));
    }

    @Transactional
    public AssignedDispatchTaskResponse dispatchByTrackingCode(
            String trackingCode,
            DispatchByTrackingCodeRequest request
    ) {
        DispatchCandidateResponse report =
                dispatchCaseService.getDispatchSummaryByTrackingCode(trackingCode);

        if (report.latitude() == null || report.longitude() == null) {
            throw new AppException(ErrorCode.REPORT_NOT_DISPATCHABLE);
        }

        if (dispatchTaskRepository.existsByCaseIdAndDispatchStatusIn(
                report.caseId(),
                List.of(DispatchStatus.PENDING, DispatchStatus.ASSIGNED)
        )) {
            throw new AppException(ErrorCode.CASE_ALREADY_DISPATCHED);
        }

        boolean smartDispatch = request == null || !Boolean.FALSE.equals(request.smartDispatch());

        if (smartDispatch) {
            SmartDispatchResponse response = smartDispatchService.dispatch(
                    new com.ngocphuoc.crime.report.dispatch.dto.request.SmartDispatchRequest(
                            report.caseId(),
                            report.latitude().doubleValue(),
                            report.longitude().doubleValue(),
                            true
                    )
            );

            return toResponse(findTask(response.dispatchTaskId()), report);
        }

        DispatchTask saved = createManualTask(report, request);
        dispatchTaskHistoryService.record(
                saved,
                "MANUAL_DISPATCH",
                null,
                saved.getDispatchStatus(),
                null,
                null,
                request.note(),
                "DISPATCHER"
        );
        reportAssignmentClient.updateAssignment(
                report.caseId(),
                saved.getAssignedUnit().getId(),
                saved.getAssignedOfficer().getId()
        );

        return toResponse(saved, report);
    }

    @Transactional
    public AssignedDispatchTaskResponse reassign(Long taskId, ReassignDispatchTaskRequest request) {
        DispatchTask task = findTask(taskId);
        DispatchStatus previousStatus = task.getDispatchStatus();
        Long previousUnitId = task.getAssignedUnit() == null ? null : task.getAssignedUnit().getId();
        Long previousOfficerId = task.getAssignedOfficer() == null ? null : task.getAssignedOfficer().getId();
        DutyAssignment oldAssignment = task.getDutyAssignment();
        releaseAssignment(oldAssignment);

        DutyAssignment nextAssignment = findAvailableAssignment(
                request == null ? null : request.assignedUnitId(),
                request == null ? null : request.assignedOfficerId()
        );

        occupyAssignment(nextAssignment, task.getCaseId());
        task.setAssignedUnit(nextAssignment.getOfficer().getUnit());
        task.setAssignedOfficer(nextAssignment.getOfficer());
        task.setDutyAssignment(nextAssignment);
        task.setDispatchStatus(DispatchStatus.ASSIGNED);
        dispatchTaskHistoryService.record(
                task,
                "REASSIGN",
                previousStatus,
                task.getDispatchStatus(),
                previousUnitId,
                previousOfficerId,
                request == null ? null : request.reason(),
                "DISPATCHER"
        );

        reportAssignmentClient.updateAssignment(
                task.getCaseId(),
                task.getAssignedUnit().getId(),
                task.getAssignedOfficer().getId()
        );

        return toResponse(task);
    }

    @Transactional
    public AssignedDispatchTaskResponse recall(Long taskId) {
        DispatchTask task = findTask(taskId);
        DispatchStatus previousStatus = task.getDispatchStatus();
        Long previousUnitId = task.getAssignedUnit() == null ? null : task.getAssignedUnit().getId();
        Long previousOfficerId = task.getAssignedOfficer() == null ? null : task.getAssignedOfficer().getId();
        releaseAssignment(task.getDutyAssignment());
        task.setDispatchStatus(DispatchStatus.CANCELLED);
        dispatchTaskHistoryService.record(
                task,
                "RECALL",
                previousStatus,
                task.getDispatchStatus(),
                previousUnitId,
                previousOfficerId,
                "Dispatch task recalled",
                "DISPATCHER"
        );
        reportAssignmentClient.updateAssignment(task.getCaseId(), null, null);
        return toResponse(task);
    }

    @Transactional
    public AssignedDispatchTaskResponse updateStatus(
            Long taskId,
            UpdateDispatchTaskStatusRequest request
    ) {
        DispatchTask task = findTask(taskId);
        DispatchStatus nextStatus = request == null ? null : request.status();

        if (nextStatus == null) {
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }

        DispatchStatus previousStatus = task.getDispatchStatus();
        task.setDispatchStatus(nextStatus);

        if (nextStatus == DispatchStatus.CANCELLED || nextStatus == DispatchStatus.COMPLETED) {
            releaseAssignment(task.getDutyAssignment());
        }

        dispatchTaskHistoryService.record(
                task,
                "STATUS_UPDATE",
                previousStatus,
                task.getDispatchStatus(),
                null,
                null,
                request.note(),
                "DISPATCHER"
        );

        return toResponse(task);
    }

    @Transactional
    public AssignedDispatchTaskResponse completeByCaseId(Long caseId, String note, String actor) {
        DispatchTask task = dispatchTaskRepository
                .findFirstByCaseIdAndDispatchStatusInOrderByCreatedAtDesc(
                        caseId,
                        List.of(DispatchStatus.PENDING, DispatchStatus.ASSIGNED)
                )
                .or(() -> dispatchTaskRepository.findFirstByCaseIdOrderByCreatedAtDesc(caseId))
                .orElse(null);

        if (task == null) {
            releaseAssignmentsStillPointingToCase(caseId);
            return null;
        }

        DispatchStatus previousStatus = task.getDispatchStatus();
        if (task.getDispatchStatus() != DispatchStatus.COMPLETED) {
            task.setDispatchStatus(DispatchStatus.COMPLETED);
        }

        releaseAssignmentForCase(task.getDutyAssignment(), caseId);
        releaseAssignmentsStillPointingToCase(caseId);

        dispatchTaskHistoryService.record(
                task,
                "CASE_COMPLETED",
                previousStatus,
                task.getDispatchStatus(),
                null,
                null,
                note == null || note.isBlank()
                        ? "Case completed by report workflow"
                        : note,
                actor == null || actor.isBlank() ? "REPORT_SERVICE" : actor
        );

        return toResponse(task);
    }

    private DispatchTask createManualTask(
            DispatchCandidateResponse report,
            DispatchByTrackingCodeRequest request
    ) {
        DutyAssignment assignment = findAvailableAssignment(
                request.assignedUnitId(),
                request.assignedOfficerId()
        );
        occupyAssignment(assignment, report.caseId());

        PoliceUnitDistanceResponse distance =
                nearestPoliceUnitService.findNearestPoliceUnit(
                        report.latitude().doubleValue(),
                        report.longitude().doubleValue()
                );

        DispatchTask task = new DispatchTask();
        task.setCaseId(report.caseId());
        task.setAssignedUnit(assignment.getOfficer().getUnit());
        task.setAssignedOfficer(assignment.getOfficer());
        task.setDutyAssignment(assignment);
        task.setIncidentLatitude(report.latitude());
        task.setIncidentLongitude(report.longitude());
        task.setDistanceKm(BigDecimal.valueOf(distance == null ? 0 : distance.distanceKm()));
        task.setDispatchStatus(DispatchStatus.ASSIGNED);

        return dispatchTaskRepository.save(task);
    }

    private DutyAssignment findAvailableAssignment(Long unitId, Long officerId) {
        LocalDateTime now = LocalDateTime.now();
        List<DutyAssignment> assignments;

        if (officerId != null) {
            assignments = dutyAssignmentRepository.findAvailableAssignmentsByOfficerForUpdate(
                    officerId,
                    AvailabilityStatus.AVAILABLE,
                    DutyShiftStatus.ACTIVE,
                    now
            );
        } else if (unitId != null) {
            assignments = dutyAssignmentRepository.findAvailableAssignmentsByUnitForUpdate(
                    unitId,
                    AvailabilityStatus.AVAILABLE,
                    DutyShiftStatus.ACTIVE,
                    now
            );
        } else {
            throw new AppException(ErrorCode.NO_AVAILABLE_OFFICER);
        }

        if (assignments.isEmpty()) {
            throw new AppException(ErrorCode.NO_AVAILABLE_OFFICER);
        }

        return assignments.getFirst();
    }

    private void occupyAssignment(DutyAssignment assignment, Long caseId) {
        assignment.setAvailabilityStatus(AvailabilityStatus.BUSY);
        assignment.setCurrentCaseId(caseId);
        assignment.setLastStatusAt(LocalDateTime.now());
    }

    private void releaseAssignment(DutyAssignment assignment) {
        if (assignment == null) return;

        assignment.setAvailabilityStatus(AvailabilityStatus.AVAILABLE);
        assignment.setCurrentCaseId(null);
        assignment.setLastStatusAt(LocalDateTime.now());
    }

    private void releaseAssignmentForCase(DutyAssignment assignment, Long caseId) {
        if (assignment == null) return;

        if (Objects.equals(assignment.getCurrentCaseId(), caseId)) {
            releaseAssignment(assignment);
        }
    }

    private void releaseAssignmentsStillPointingToCase(Long caseId) {
        dutyAssignmentRepository.findByCurrentCaseId(caseId)
                .forEach(assignment -> releaseAssignmentForCase(assignment, caseId));
    }

    private DispatchTask findTask(Long taskId) {
        return dispatchTaskRepository.findById(taskId)
                .orElseThrow(() -> new AppException(ErrorCode.DISPATCH_TASK_NOT_FOUND));
    }

    private AssignedDispatchTaskResponse toResponse(DispatchTask task) {
        DispatchCandidateResponse report = reportAssignmentClient.getDispatchSummary(task.getCaseId());
        return toResponse(task, report);
    }

    private AssignedDispatchTaskResponse toResponse(
            DispatchTask task,
            DispatchCandidateResponse report
    ) {
        return new AssignedDispatchTaskResponse(
                task.getId(),
                task.getCaseId(),
                report == null ? null : report.trackingCode(),
                report == null ? null : report.title(),
                report == null ? null : report.urgencyLevel(),
                report == null ? null : report.address(),
                task.getAssignedUnit().getId(),
                task.getAssignedUnit().getCode(),
                task.getAssignedUnit().getName(),
                task.getAssignedOfficer().getId(),
                task.getAssignedOfficer().getUserId(),
                task.getAssignedOfficer().getBadgeNumber(),
                task.getAssignedOfficer().getRankName(),
                task.getDistanceKm() == null ? null : task.getDistanceKm().doubleValue(),
                task.getDispatchStatus(),
                task.getCreatedAt(),
                task.getUpdatedAt()
        );
    }
}
