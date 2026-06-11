package com.ngocphuoc.crime.report.dispatch.repository;

import com.ngocphuoc.crime.report.dispatch.entity.PoliceUnit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PoliceUnitRepository extends JpaRepository<PoliceUnit, Long> {
    Optional<PoliceUnit> findByCode(String code);

    List<PoliceUnit> findByIsActiveTrueOrderByIdAsc();
}
