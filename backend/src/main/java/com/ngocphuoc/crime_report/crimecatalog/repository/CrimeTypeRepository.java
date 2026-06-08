package com.ngocphuoc.crime_report.crimecatalog.repository;

import com.ngocphuoc.crime_report.crimecatalog.entity.CrimeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CrimeTypeRepository extends JpaRepository<CrimeType, Long> {

    @Query("""
            SELECT ct
            FROM CrimeType ct
            JOIN FETCH ct.category c
            WHERE ct.isActive = true
              AND c.isActive = true
            ORDER BY c.id ASC, ct.id ASC
            """)
    List<CrimeType> findAllActiveWithCategory();
}