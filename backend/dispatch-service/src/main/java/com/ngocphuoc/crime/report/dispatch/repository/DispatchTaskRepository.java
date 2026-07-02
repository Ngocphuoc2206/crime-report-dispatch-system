package com.ngocphuoc.crime.report.dispatch.repository;

import com.ngocphuoc.crime.report.dispatch.entity.DispatchTask;
import com.ngocphuoc.crime.report.dispatch.enums.DispatchStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface DispatchTaskRepository extends JpaRepository<DispatchTask, Long> {
    Optional<DispatchTask> findFirstByCaseIdOrderByCreatedAtDesc(Long caseId);

    Optional<DispatchTask> findFirstByCaseIdAndDispatchStatusInOrderByCreatedAtDesc(
            Long caseId,
            Collection<DispatchStatus> statuses
    );

    boolean existsByCaseId(Long caseId);

    boolean existsByCaseIdAndDispatchStatusIn(Long caseId, Collection<DispatchStatus> statuses);

    List<DispatchTask> findAllByOrderByCreatedAtDesc();

    List<DispatchTask> findByDispatchStatusInOrderByCreatedAtDesc(Collection<DispatchStatus> statuses);
}
