package com.ngocphuoc.crime.report.dispatch.service;

import com.ngocphuoc.crime.report.common.ErrorCode;
import com.ngocphuoc.crime.report.dispatch.dto.response.OfficerProfileResponse;
import com.ngocphuoc.crime.report.dispatch.entity.Officer;
import com.ngocphuoc.crime.report.dispatch.repository.OfficerRepository;
import com.ngocphuoc.crime_report.shared.exception.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OfficerProfileService {
    private final OfficerRepository officerRepository;

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
}
