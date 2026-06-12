package com.ngocphuoc.crime.report.dispatch.repository;

import com.ngocphuoc.crime.report.dispatch.entity.DutyShift;
import com.ngocphuoc.crime.report.dispatch.enums.DutyShiftStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface DutyShiftRepository extends JpaRepository<DutyShift, Long> {
    Optional<DutyShift> findByCode(String code);

    List<DutyShift> findByShiftStatusAndStartAtLessThanEqualAndEndAtGreaterThanEqual(
        DutyShiftStatus shiftStatus,
        LocalDateTime startAt,
        LocalDateTime endAt
    );
}
