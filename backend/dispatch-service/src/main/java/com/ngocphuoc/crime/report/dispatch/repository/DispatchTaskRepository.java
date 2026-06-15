package com.ngocphuoc.crime.report.dispatch.repository;

import com.ngocphuoc.crime.report.dispatch.entity.DispatchTask;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DispatchTaskRepository extends JpaRepository<DispatchTask, Long> {
    Optional<DispatchTask> findByCaseId(Long caseId);

    boolean existsByCaseId(Long caseId);
}
