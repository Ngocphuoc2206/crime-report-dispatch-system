package com.ngocphuoc.crime_report.crimecatalog.repository;

import com.ngocphuoc.crime_report.crimecatalog.entity.CrimeCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CrimeCategoryRepository extends JpaRepository<CrimeCategory, Long> {
}
