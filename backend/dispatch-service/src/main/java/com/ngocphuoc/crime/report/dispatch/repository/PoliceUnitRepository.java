package com.ngocphuoc.crime.report.dispatch.repository;

import com.ngocphuoc.crime.report.dispatch.entity.PoliceUnit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface PoliceUnitRepository extends JpaRepository<PoliceUnit, Long> {
    Optional<PoliceUnit> findByCode(String code);

    List<PoliceUnit> findByIsActiveTrueOrderByIdAsc();

    @Query("SELECT p FROM PoliceUnit p WHERE p.isActive = true " +
            "AND p.latitude BETWEEN :minLat AND :maxLat " +
            "AND p.longitude BETWEEN :minLon AND :maxLon")
    List<PoliceUnit> findUnitsWithinBox(
            @Param("minLat") BigDecimal minLat, @Param("maxLat") BigDecimal maxLat,
            @Param("minLon") BigDecimal minLon, @Param("maxLon") BigDecimal maxLon
    );
}
