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
import java.util.List;

@Service
@RequiredArgsConstructor
public class DutyAvailabilityService {
    private final DutyAssignmentRepository dutyAssignmentRepository;

    @Transactional(readOnly = true)
    public List<OfficerAvailabilityResponse> getCurrentAssignments(){
        LocalDateTime now = LocalDateTime.now();
        return dutyAssignmentRepository.findCurrentAssignments(DutyShiftStatus.ACTIVE, now)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<OfficerAvailabilityResponse> getCurrentAssignmentsByStatus(AvailabilityStatus status) {
        LocalDateTime now = LocalDateTime.now();

        return dutyAssignmentRepository
                .findCurrentAssignmentsByStatus(status, DutyShiftStatus.ACTIVE, now)
                .stream()
                .map(this::toResponse)
                .toList();
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
