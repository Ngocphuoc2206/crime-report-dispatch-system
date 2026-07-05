package com.ngocphuoc.crime.report.dispatch.service;

import com.ngocphuoc.crime.report.dispatch.dto.response.OfficerAvailabilityResponse;
import com.ngocphuoc.crime.report.dispatch.entity.DutyAssignment;
import com.ngocphuoc.crime.report.dispatch.enums.AvailabilityStatus;
import com.ngocphuoc.crime.report.dispatch.enums.DutyShiftStatus;
import com.ngocphuoc.crime.report.dispatch.repository.DutyAssignmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DutyAvailabilityService {
    private final DutyAssignmentRepository dutyAssignmentRepository;

    @Transactional(readOnly = true)
    public List<OfficerAvailabilityResponse> getCurrentAssignments(){
        LocalDateTime now = LocalDateTime.now();
        return dutyAssignmentRepository.findCurrentAssignments(DutyShiftStatus.ACTIVE, now)
                .stream()
                .collect(
                        LinkedHashMap<Long, DutyAssignment>::new,
                        this::keepLatestAssignmentByOfficer,
                        Map::putAll
                )
                .values()
                .stream()
                .sorted(Comparator.comparing(assignment -> assignment.getOfficer().getId()))
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<OfficerAvailabilityResponse> getCurrentAssignmentsByStatus(AvailabilityStatus status) {
        LocalDateTime now = LocalDateTime.now();

        return dutyAssignmentRepository.findCurrentAssignments(DutyShiftStatus.ACTIVE, now)
                .stream()
                .collect(
                        LinkedHashMap<Long, DutyAssignment>::new,
                        this::keepLatestAssignmentByOfficer,
                        Map::putAll
                )
                .values()
                .stream()
                .filter(assignment -> assignment.getAvailabilityStatus() == status)
                .sorted(Comparator.comparing(assignment -> assignment.getOfficer().getId()))
                .map(this::toResponse)
                .toList();
    }

    private void keepLatestAssignmentByOfficer(Map<Long, DutyAssignment> assignments, DutyAssignment candidate) {
        Long officerId = candidate.getOfficer().getId();
        DutyAssignment current = assignments.get(officerId);

        if (current == null || isNewer(candidate, current)) {
            assignments.put(officerId, candidate);
        }
    }

    private boolean isNewer(DutyAssignment candidate, DutyAssignment current) {
        LocalDateTime candidateTime = timestampOf(candidate);
        LocalDateTime currentTime = timestampOf(current);

        int compared = candidateTime.compareTo(currentTime);
        if (compared != 0) {
            return compared > 0;
        }

        return candidate.getId() > current.getId();
    }

    private LocalDateTime timestampOf(DutyAssignment assignment) {
        if (assignment.getLastStatusAt() != null) {
            return assignment.getLastStatusAt();
        }

        if (assignment.getUpdatedAt() != null) {
            return assignment.getUpdatedAt();
        }

        if (assignment.getCreatedAt() != null) {
            return assignment.getCreatedAt();
        }

        return LocalDateTime.MIN;
    }

    private OfficerAvailabilityResponse toResponse(DutyAssignment assignment) {
        return new OfficerAvailabilityResponse(
                assignment.getOfficer().getId(),
                assignment.getOfficer().getUserId(),
                assignment.getOfficer().getBadgeNumber(),
                assignment.getOfficer().getRankName(),

                assignment.getOfficer().getUnit().getId(),
                assignment.getOfficer().getUnit().getName(),

                assignment.getShift().getId(),
                assignment.getShift().getCode(),
                assignment.getShift().getName(),

                assignment.getAvailabilityStatus(),
                assignment.getCurrentCaseId(),
                assignment.getShift().getStartAt(),
                assignment.getShift().getEndAt(),
                assignment.getLastStatusAt()
        );
    }
}
