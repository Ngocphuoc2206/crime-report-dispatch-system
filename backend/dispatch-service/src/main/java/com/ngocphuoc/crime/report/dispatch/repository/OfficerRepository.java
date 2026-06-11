package com.ngocphuoc.crime.report.dispatch.repository;

import com.ngocphuoc.crime.report.dispatch.entity.Officer;
import com.ngocphuoc.crime.report.dispatch.enums.OfficerStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OfficerRepository extends JpaRepository<Officer, Long> {
    Optional<Officer> findByUserId(Long userId);

    List<Officer> findByOfficerStatusOrderByIdAsc(OfficerStatus officerStatus);
}
