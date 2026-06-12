package com.ngocphuoc.crime.report.dispatch.dto.response;

import com.ngocphuoc.crime.report.dispatch.enums.AvailabilityStatus;

import java.time.LocalDateTime;

public record OfficerAvailabilityResponse(
        Long officerId,
        Long userId,
        String badgeNumber,
        String rankName,

        Long unitId,
        String unitName,

        Long shiftId,
        String shiftCode,
        String shiftName,

        AvailabilityStatus availabilityStatus,
        Long currentCaseId,
        LocalDateTime shiftStartAt,
        LocalDateTime shiftEndAt,
        LocalDateTime lastStatusAt
) {
}
