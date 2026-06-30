package com.ngocphuoc.crime.report.dispatch.service;

import com.ngocphuoc.crime.report.dispatch.dto.response.DispatchMapCaseResponse;
import com.ngocphuoc.crime.report.dispatch.dto.response.DispatchMapUnitResponse;
import com.ngocphuoc.crime.report.dispatch.dto.response.PendingDispatchCaseResponse;
import com.ngocphuoc.crime.report.dispatch.entity.PoliceUnit;
import com.ngocphuoc.crime.report.dispatch.repository.PoliceUnitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DispatchMapService {
    private final DispatchCaseService dispatchCaseService;
    private final PoliceUnitRepository policeUnitRepository;

    public List<DispatchMapCaseResponse> getCases() {
        return dispatchCaseService.getPendingCases()
                .stream()
                .map(this::toMapCase)
                .toList();
    }

    public List<DispatchMapUnitResponse> getUnits() {
        return policeUnitRepository.findByIsActiveTrueOrderByIdAsc()
                .stream()
                .map(this::toMapUnit)
                .toList();
    }

    private DispatchMapCaseResponse toMapCase(PendingDispatchCaseResponse item) {
        return new DispatchMapCaseResponse(
                item.caseId(),
                item.trackingCode(),
                item.title(),
                item.urgencyLevel(),
                item.status(),
                item.address(),
                item.latitude(),
                item.longitude(),
                null,
                null
        );
    }

    private DispatchMapUnitResponse toMapUnit(PoliceUnit unit) {
        return new DispatchMapUnitResponse(
                unit.getId(),
                unit.getCode(),
                unit.getName(),
                Boolean.TRUE.equals(unit.getIsActive()) ? "READY" : "OFFLINE",
                unit.getAddress(),
                unit.getLatitude(),
                unit.getLongitude()
        );
    }
}
