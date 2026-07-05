package com.ngocphuoc.crime.report.dispatch.repository;

import com.ngocphuoc.crime.report.dispatch.entity.DispatchTaskHistory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DispatchTaskHistoryRepository extends JpaRepository<DispatchTaskHistory, Long> {
    List<DispatchTaskHistory> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
