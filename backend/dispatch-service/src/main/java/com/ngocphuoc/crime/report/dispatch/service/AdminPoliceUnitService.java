package com.ngocphuoc.crime.report.dispatch.service;

import com.ngocphuoc.crime.report.common.ErrorCode;
import com.ngocphuoc.crime.report.dispatch.dto.request.CreatePoliceUnitRequest;
import com.ngocphuoc.crime.report.dispatch.dto.request.UpdatePoliceUnitRequest;
import com.ngocphuoc.crime.report.dispatch.dto.response.AdminPoliceUnitResponse;
import com.ngocphuoc.crime.report.dispatch.dto.response.AdministrativeAreaResponse;
import com.ngocphuoc.crime.report.dispatch.entity.AdministrativeArea;
import com.ngocphuoc.crime.report.dispatch.entity.PoliceUnit;
import com.ngocphuoc.crime.report.dispatch.repository.AdministrativeAreaRepository;
import com.ngocphuoc.crime.report.dispatch.repository.PoliceUnitRepository;
import com.ngocphuoc.crime_report.shared.exception.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminPoliceUnitService {
    private final PoliceUnitRepository policeUnitRepository;
    private final AdministrativeAreaRepository administrativeAreaRepository;

    @Transactional(readOnly = true)
    public List<AdminPoliceUnitResponse> getUnits() {
        return policeUnitRepository.findAllByOrderByIdAsc()
                .stream()
                .map(this::toUnitResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AdministrativeAreaResponse> getAreas() {
        return administrativeAreaRepository.findAll()
                .stream()
                .map(this::toAreaResponse)
                .toList();
    }

    @Transactional
    public AdminPoliceUnitResponse create(CreatePoliceUnitRequest request) {
        String code = request.code().trim().toUpperCase();
        if (policeUnitRepository.existsByCodeIgnoreCase(code)) {
            throw new AppException(ErrorCode.POLICE_UNIT_CODE_ALREADY_EXISTS);
        }

        AdministrativeArea area = findArea(request.areaId());
        PoliceUnit unit = new PoliceUnit();
        unit.setCode(code);
        unit.setName(request.name().trim());
        unit.setArea(area);
        unit.setAddress(request.address());
        unit.setLatitude(request.latitude());
        unit.setLongitude(request.longitude());
        unit.setUnitType(request.unitType());
        unit.setIsActive(request.active() == null || request.active());

        return toUnitResponse(policeUnitRepository.save(unit));
    }

    @Transactional
    public AdminPoliceUnitResponse update(Long unitId, UpdatePoliceUnitRequest request) {
        PoliceUnit unit = policeUnitRepository.findById(unitId)
                .orElseThrow(() -> new AppException(ErrorCode.POLICE_UNIT_NOT_FOUND));

        if (request.code() != null && !request.code().isBlank()) {
            String code = request.code().trim().toUpperCase();
            if (policeUnitRepository.existsByCodeIgnoreCaseAndIdNot(code, unitId)) {
                throw new AppException(ErrorCode.POLICE_UNIT_CODE_ALREADY_EXISTS);
            }
            unit.setCode(code);
        }

        if (request.name() != null && !request.name().isBlank()) {
            unit.setName(request.name().trim());
        }
        if (request.areaId() != null) {
            unit.setArea(findArea(request.areaId()));
        }
        if (request.address() != null) unit.setAddress(request.address());
        if (request.latitude() != null) unit.setLatitude(request.latitude());
        if (request.longitude() != null) unit.setLongitude(request.longitude());
        if (request.unitType() != null) unit.setUnitType(request.unitType());
        if (request.active() != null) unit.setIsActive(request.active());

        return toUnitResponse(unit);
    }

    private AdministrativeArea findArea(Long areaId) {
        return administrativeAreaRepository.findById(areaId)
                .orElseThrow(() -> new AppException(ErrorCode.ADMINISTRATIVE_AREA_NOT_FOUND));
    }

    private AdminPoliceUnitResponse toUnitResponse(PoliceUnit unit) {
        return new AdminPoliceUnitResponse(
                unit.getId(),
                unit.getCode(),
                unit.getName(),
                unit.getArea().getId(),
                unit.getArea().getName(),
                unit.getAddress(),
                unit.getLatitude(),
                unit.getLongitude(),
                unit.getUnitType(),
                unit.getIsActive(),
                unit.getCreatedAt(),
                unit.getUpdatedAt()
        );
    }

    private AdministrativeAreaResponse toAreaResponse(AdministrativeArea area) {
        return new AdministrativeAreaResponse(
                area.getId(),
                area.getCode(),
                area.getName(),
                area.getAreaType(),
                area.getParent() == null ? null : area.getParent().getId()
        );
    }
}
