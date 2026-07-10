package com.ngocphuoc.crime.report.dispatch.repository;

import com.ngocphuoc.crime.report.dispatch.entity.DutyAssignment;
import com.ngocphuoc.crime.report.dispatch.enums.AvailabilityStatus;
import com.ngocphuoc.crime.report.dispatch.enums.DutyShiftStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface DutyAssignmentRepository extends JpaRepository<DutyAssignment, Long> {
    @Query("""
        SELECT da
        FROM DutyAssignment da
        JOIN FETCH da.shift s
        JOIN FETCH da.officer o
        JOIN FETCH o.unit u
        WHERE s.shiftStatus = :shiftStatus
            AND s.startAt <= :now
            AND s.endAt >= :now
        order by da.id asc 
    """)
    List<DutyAssignment> findCurrentAssignments(
            @Param("shiftStatus") DutyShiftStatus shiftStatus,
            @Param("now") LocalDateTime now
    );

    @Query("""
            SELECT da
            FROM DutyAssignment da
            JOIN FETCH da.shift s
            JOIN FETCH da.officer o
            JOIN FETCH o.unit u
            WHERE da.availabilityStatus = :availabilityStatus
              AND s.shiftStatus = :shiftStatus
              AND s.startAt <= :now
              AND s.endAt >= :now
            ORDER BY da.id ASC
            """)
    List<DutyAssignment> findCurrentAssignmentsByStatus(
            @Param("availabilityStatus") AvailabilityStatus availabilityStatus,
            @Param("shiftStatus") DutyShiftStatus shiftStatus,
            @Param("now") LocalDateTime now
    );

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        SELECT da
        FROM DutyAssignment da
        JOIN FETCH da.shift s
        JOIN fetch da.officer o
        JOIN FETCH o.unit u
        WHERE u.id = :unitId
            AND da.availabilityStatus = :availabilityStatus
            AND s.shiftStatus = :shiftStatus
            AND s.startAt <= :now
            AND s.endAt >= :now
        ORDER BY da.id ASC
        """)
    List<DutyAssignment> findAvailableAssignmentsByUnitForUpdate(
            @Param("unitId") Long unitId,
            @Param("availabilityStatus") AvailabilityStatus availabilityStatus,
            @Param("shiftStatus") DutyShiftStatus shiftStatus,
            @Param("now") LocalDateTime now
    );

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        SELECT da
        FROM DutyAssignment da
        JOIN FETCH da.shift s
        JOIN FETCH da.officer o
        JOIN FETCH o.unit u
        WHERE o.id = :officerId
            AND da.availabilityStatus = :availabilityStatus
            AND s.shiftStatus = :shiftStatus
            AND s.startAt <= :now
            AND s.endAt >= :now
        ORDER BY da.id ASC
        """)
    List<DutyAssignment> findAvailableAssignmentsByOfficerForUpdate(
            @Param("officerId") Long officerId,
            @Param("availabilityStatus") AvailabilityStatus availabilityStatus,
            @Param("shiftStatus") DutyShiftStatus shiftStatus,
            @Param("now") LocalDateTime now
    );

    List<DutyAssignment> findByCurrentCaseId(Long currentCaseId);
}
