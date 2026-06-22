package com.ngocphuoc.crime_report.crimecatalog.service;

import com.ngocphuoc.crime_report.common.ErrorCode;
import com.ngocphuoc.crime_report.crimecatalog.dto.request.CrimeTypeRequest;
import com.ngocphuoc.crime_report.crimecatalog.dto.response.CrimeCategoryResponse;
import com.ngocphuoc.crime_report.crimecatalog.dto.response.CrimeTypeResponse;
import com.ngocphuoc.crime_report.crimecatalog.entity.CrimeCategory;
import com.ngocphuoc.crime_report.crimecatalog.entity.CrimeType;
import com.ngocphuoc.crime_report.crimecatalog.repository.CrimeCategoryRepository;
import com.ngocphuoc.crime_report.crimecatalog.repository.CrimeTypeRepository;
import com.ngocphuoc.crime_report.shared.exception.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class AdminCrimeTypeService {
    private final CrimeTypeRepository crimeTypeRepository;
    private final CrimeCategoryRepository crimeCategoryRepository;

    public List<CrimeTypeResponse> getAll(){
        return crimeTypeRepository.findAll().stream().map(this::toCrimeTypeResponse).toList();
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
                crimeType.getIsActive(),
                categoryResponse
        );
    }

    public CrimeTypeResponse createCrimeType(CrimeTypeRequest request){
        String newCode = request.code().trim().toUpperCase(Locale.ROOT);

        // Check code has saved
        if (crimeTypeRepository.existsByCodeIgnoreCase(newCode)){
            throw new AppException(ErrorCode.CRIME_TYPE_CODE_EXISTS);
        }

        CrimeCategory crimeCategory = crimeCategoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new AppException(ErrorCode.CRIME_NOT_FOUND));

        CrimeType crimeType = new CrimeType();
        crimeType.setCode(newCode);
        crimeType.setName(request.name());
        crimeType.setCategory(crimeCategory);
        crimeType.setBaseScore(request.baseScore());
        crimeType.setDescription(request.description());
        crimeType.setIsActive(request.isActive());
        crimeType.setCreatedAt(LocalDateTime.now());
        crimeType.setUpdatedAt(null);

        crimeTypeRepository.save(crimeType);
        return toResponse(crimeType, crimeCategory);
    }

    @Transactional
    public CrimeTypeResponse updateCrimeType(Long id, CrimeTypeRequest request){
        CrimeType crimeType = crimeTypeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CRIME_TYPE_CODE_EXISTS));

        // Check code and id of crimeType
        if (crimeTypeRepository.existsByCodeIgnoreCaseAndIdNot(request.code(), id)){
            throw new AppException((ErrorCode.CRIME_TYPE_CODE_EXISTS));
        }

        CrimeCategory crimeCategory = crimeCategoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new AppException(ErrorCode.CRIME_NOT_FOUND));

        crimeType.setCode(request.code());
        crimeType.setName(request.name());
        crimeType.setCategory(crimeCategory);
        crimeType.setIsActive(request.isActive());
        crimeType.setDescription(request.description());
        crimeType.setUpdatedAt(LocalDateTime.now());
        crimeType.setBaseScore(request.baseScore());

        crimeTypeRepository.save(crimeType);
        return toResponse(crimeType, crimeCategory);
    }

    private CrimeTypeResponse toResponse(CrimeType crimeType, CrimeCategory crimeCategory) {

        CrimeCategoryResponse categoryResponse = new CrimeCategoryResponse(
                crimeCategory.getId(),
                crimeCategory.getCode(),
                crimeCategory.getName(),
                crimeCategory.getDefaultUrgencyLevel()
        );

        return new CrimeTypeResponse(
                crimeType.getId(),
                crimeType.getCode(),
                crimeType.getName(),
                crimeType.getDescription(),
                crimeType.getBaseScore(),
                crimeType.getIsActive(),
                categoryResponse
        );
    }


}
