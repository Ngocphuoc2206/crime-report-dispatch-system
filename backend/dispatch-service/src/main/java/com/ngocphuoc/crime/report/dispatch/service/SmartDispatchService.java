package com.ngocphuoc.crime.report.dispatch.service;

import com.ngocphuoc.crime.report.common.ErrorCode;
import com.ngocphuoc.crime.report.dispatch.client.ReportAssignmentClient;
import com.ngocphuoc.crime.report.dispatch.dto.request.SmartDispatchRequest;
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

@Service
@RequiredArgsConstructor
public class SmartDispatchService {
    private static final int CANDIDATE_UNIT_LIMIT = 10;

    private final NearestPoliceUnitService nearestPoliceUnitService;
    private final DutyAssignmentRepository dutyAssignmentRepository;
    private final DispatchTaskRepository dispatchTaskRepository;
    private final ReportAssignmentClient reportAssignmentClient;

    @Transactional
    public SmartDispatchResponse dispatch(SmartDispatchRequest request){
        validateRequest(request);

        // Check case id is already dispatched
        if (dispatchTaskRepository.existsByCaseId(request.caseId())){
            throw new AppException(ErrorCode.CASE_ALREADY_DISPATCHED);
        }

        // Find the nearest units from distance occur incident around 20km
        List<PoliceUnitDistanceResponse> nearestUnits =
                nearestPoliceUnitService.findNearestPoliceUnits(
                        request.incidentLatitude(),
                        request.incidentLongitude(),
                        CANDIDATE_UNIT_LIMIT
                );

        if (nearestUnits.isEmpty()){
            throw new AppException(ErrorCode.NO_POLICE_UNIT_FOUND_NEARBY);
        }
        LocalDateTime now = LocalDateTime.now();

        for (PoliceUnitDistanceResponse unit: nearestUnits){
            List<DutyAssignment> availableAssignments =
                    dutyAssignmentRepository.findAvailableAssignmentsByUnitForUpdate(
                            unit.unitId(),
                            AvailabilityStatus.AVAILABLE,
                            DutyShiftStatus.ACTIVE,
                            now
                    );

            if (!availableAssignments.isEmpty()){
                // assign duty assignment nearest
                DutyAssignment selectedAssignment = availableAssignments.getFirst();

                selectedAssignment.setAvailabilityStatus(AvailabilityStatus.BUSY);
                selectedAssignment.setCurrentCaseId(request.caseId());
                selectedAssignment.setLastStatusAt(now);

                // set value of dispatch task
                DispatchTask dispatchTask = new DispatchTask();
                dispatchTask.setCaseId(request.caseId());
                dispatchTask.setAssignedUnit(selectedAssignment.getOfficer().getUnit());
                dispatchTask.setAssignedOfficer(selectedAssignment.getOfficer());
                dispatchTask.setDutyAssignment(selectedAssignment);
                dispatchTask.setIncidentLatitude(BigDecimal.valueOf(request.incidentLatitude()));
                dispatchTask.setIncidentLongitude(BigDecimal.valueOf(request.incidentLongitude()));
                dispatchTask.setDistanceKm(BigDecimal.valueOf(unit.distanceKm()));
                dispatchTask.setDispatchStatus(DispatchStatus.ASSIGNED);

                DispatchTask savedTask = dispatchTaskRepository.save(dispatchTask);

                if (request.shouldUpdateReportAssignment()) {
                    reportAssignmentClient.updateAssignment(
                            request.caseId(),
                            selectedAssignment.getOfficer().getUnit().getId(),
                            selectedAssignment.getOfficer().getId()
                    );
                }
                return toResponse(savedTask, unit);
            }
        }
        throw new AppException(ErrorCode.NO_AVAILABLE_OFFICER);
    }

    private SmartDispatchResponse toResponse(
            DispatchTask task,
            PoliceUnitDistanceResponse unit
    ){
        return new SmartDispatchResponse(
                task.getId(),
                task.getCaseId(),

                task.getAssignedUnit().getId(),
                task.getAssignedUnit().getCode(),
                task.getAssignedUnit().getName(),

                task.getAssignedOfficer().getId(),
                task.getAssignedOfficer().getUserId(),
                task.getAssignedOfficer().getBadgeNumber(),
                task.getAssignedOfficer().getRankName(),

                unit.distanceKm(),
                task.getDispatchStatus()
        );
    }

    private void validateRequest(SmartDispatchRequest request) {
        if (request.caseId() == null){
            throw new AppException(ErrorCode.CASE_ID_REQUIRED);
        }

        if (request.incidentLatitude() == null) {
            throw new AppException(ErrorCode.LATITUDE_NOT_SUITABLE);
        }

        if (request.incidentLongitude() == null) {
            throw new AppException(ErrorCode.LONGITUDE_NOT_SUITABLE);
        }
    }
}
