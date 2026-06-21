package com.ngocphuoc.crime_report.report.repository;

import com.ngocphuoc.crime_report.report.entity.CaseLock;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CaseLockRepository extends JpaRepository<CaseLock, Long> {
    Optional<CaseLock> findByCaseId(Long caseId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        SELECT cl
        FROM CaseLock cl
        WHERE cl.caseId = :caseId
        """)
    Optional<CaseLock> findByCaseIdForUpdate(@Param("caseId") Long caseId);
}
