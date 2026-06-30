package com.ngocphuoc.crime.report.dispatch.service;

import com.ngocphuoc.crime.report.common.ErrorCode;
import com.ngocphuoc.crime.report.dispatch.dto.request.CreateOfficerRequest;
import com.ngocphuoc.crime.report.dispatch.dto.request.UpdateOfficerRequest;
import com.ngocphuoc.crime.report.dispatch.dto.response.AdminOfficerResponse;
import com.ngocphuoc.crime.report.dispatch.dto.response.OfficerProfileResponse;
import com.ngocphuoc.crime.report.dispatch.entity.Officer;
import com.ngocphuoc.crime.report.dispatch.entity.PoliceUnit;
import com.ngocphuoc.crime.report.dispatch.enums.OfficerStatus;
import com.ngocphuoc.crime.report.dispatch.repository.OfficerRepository;
import com.ngocphuoc.crime.report.dispatch.repository.PoliceUnitRepository;
import com.ngocphuoc.crime_report.shared.exception.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OfficerProfileService {
    private final OfficerRepository officerRepository;
    private final PoliceUnitRepository policeUnitRepository;

    @Transactional(readOnly = true)
    public OfficerProfileResponse getByUserId(Long userId){
        Officer officer = officerRepository.findByUserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.OFFICER_NOT_FOUND));

        return new OfficerProfileResponse(
                officer.getId(),
                officer.getUserId(),
                officer.getUnit().getId(),
                officer.getUnit().getName(),
                officer.getBadgeNumber(),
                officer.getRankName()
        );
    }

    @Transactional
    public OfficerProfileResponse createOfficer(CreateOfficerRequest request){
        if (officerRepository.existsByUserId(request.userId())){
            throw new AppException(ErrorCode.OFFICER_USER_ALREADY_EXISTS);
        }

        String badgeNumber = request.badgeNumber().trim().toUpperCase();

        if(officerRepository.existsByBadgeNumberIgnoreCase(badgeNumber)){
            throw new AppException(ErrorCode.BADGE_NUMBER_ALREADY_EXISTS);
        }

        PoliceUnit unit = policeUnitRepository.findById(request.unitId())
                .orElseThrow(() -> new AppException(ErrorCode.POLICE_UNIT_NOT_FOUND));

        Officer officer = new Officer();

        officer.setUserId(request.userId());
        officer.setUnit(unit);
        officer.setBadgeNumber(badgeNumber);
        officer.setRankName(request.rankName());
        officer.setOfficerStatus(OfficerStatus.ACTIVE);

        officerRepository.save(officer);

        return new OfficerProfileResponse(
                officer.getId(),
                officer.getUserId(),
                unit.getId(),
                unit.getName(),
                officer.getBadgeNumber(),
                officer.getRankName()
        );
    }

    @Transactional(readOnly = true)
    public List<AdminOfficerResponse> getAllForAdmin() {
        return officerRepository.findAllByOrderByIdAsc()
                .stream()
                .map(this::toAdminResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AdminOfficerResponse getAdminDetail(Long officerId) {
        Officer officer = officerRepository.findById(officerId)
                .orElseThrow(() -> new AppException(ErrorCode.OFFICER_NOT_FOUND));

        return toAdminResponse(officer);
    }

    @Transactional
    public AdminOfficerResponse updateOfficer(Long officerId, UpdateOfficerRequest request) {
        Officer officer = officerRepository.findById(officerId)
                .orElseThrow(() -> new AppException(ErrorCode.OFFICER_NOT_FOUND));

        if (request.unitId() != null) {
            PoliceUnit unit = policeUnitRepository.findById(request.unitId())
                    .orElseThrow(() -> new AppException(ErrorCode.POLICE_UNIT_NOT_FOUND));
            officer.setUnit(unit);
        }

        if (request.badgeNumber() != null && !request.badgeNumber().isBlank()) {
            String badgeNumber = request.badgeNumber().trim().toUpperCase();
            if (officerRepository.existsByBadgeNumberIgnoreCaseAndIdNot(badgeNumber, officerId)) {
                throw new AppException(ErrorCode.BADGE_NUMBER_ALREADY_EXISTS);
            }
            officer.setBadgeNumber(badgeNumber);
        }

        if (request.rankName() != null && !request.rankName().isBlank()) {
            officer.setRankName(request.rankName().trim());
        }

        if (request.officerStatus() != null) {
            officer.setOfficerStatus(request.officerStatus());
        }

        return toAdminResponse(officer);
    }

    private AdminOfficerResponse toAdminResponse(Officer officer) {
        return new AdminOfficerResponse(
                officer.getId(),
                officer.getUserId(),
                officer.getUnit().getId(),
                officer.getUnit().getName(),
                officer.getBadgeNumber(),
                officer.getRankName(),
                officer.getOfficerStatus(),
                officer.getCreatedAt(),
                officer.getUpdatedAt()
        );
    }
}
