package com.ngocphuoc.crime_report.service;

import com.ngocphuoc.crime_report.dto.response.CrimeCategoryResponse;
import com.ngocphuoc.crime_report.dto.response.CrimeTypeResponse;
import com.ngocphuoc.crime_report.entity.CrimeCategory;
import com.ngocphuoc.crime_report.entity.CrimeType;
import com.ngocphuoc.crime_report.repository.CrimeTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CrimeCatalogService {
    private final CrimeTypeRepository crimeTypeRepository;

    public List<CrimeTypeResponse> getActiveCrimeTypes(){
        return crimeTypeRepository.findAllActiveWithCategory().stream().map(this::toCrimeTypeResponse).toList();
    }

    private CrimeTypeResponse toCrimeTypeResponse(CrimeType crimeType) {
        CrimeCategory category = crimeType.getCategory();

        CrimeCategoryResponse categoryResponse = new CrimeCategoryResponse(
                category.getId(),
                category.getCode(),
                category.getName(),
                category.getDefaultUrgencyLevel()
        );

        return new CrimeTypeResponse(
                crimeType.getId(),
                crimeType.getCode(),
                crimeType.getName(),
                crimeType.getDescription(),
                crimeType.getBaseScore(),
                categoryResponse
        );
    }
}
