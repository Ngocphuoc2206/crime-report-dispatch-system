package com.ngocphuoc.crime_report.repository;

import com.ngocphuoc.crime_report.entity.CrimeCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CrimeCategoryRepository extends JpaRepository<CrimeCategory, Long> {
}
