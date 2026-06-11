package com.ngocphuoc.crime.report.dispatch.repository;

import com.ngocphuoc.crime.report.dispatch.entity.AdministrativeArea;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdministrativeAreaRepository extends JpaRepository<AdministrativeArea, Long> {
    Optional<AdministrativeArea> findByCode(String code);
}
