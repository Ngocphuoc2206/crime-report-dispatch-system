package com.ngocphuoc.crime_report.urgency.service;

import com.ngocphuoc.crime_report.common.ErrorCode;
import com.ngocphuoc.crime_report.shared.exception.AppException;
import com.ngocphuoc.crime_report.urgency.dto.request.UrgencyRuleRequest;
import com.ngocphuoc.crime_report.urgency.dto.request.UrgencyRuleUpdateRequest;
import com.ngocphuoc.crime_report.urgency.dto.response.UrgencyRuleResponse;
import com.ngocphuoc.crime_report.urgency.entity.UrgencyRule;
import com.ngocphuoc.crime_report.urgency.repository.UrgencyAdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UrgencyAdminService {
    private final UrgencyAdminRepository urgencyAdminRepository;

    @Transactional(readOnly = true)
    public List<UrgencyRuleResponse> getAll() {
        return urgencyAdminRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public UrgencyRuleResponse createUrgencyRule(UrgencyRuleRequest request){
        String ruleCode = request.ruleCode().trim().toUpperCase();
        
        if (urgencyAdminRepository.existsByRuleCode(ruleCode)) {
            throw new AppException(ErrorCode.RULE_CODE_ALREADY_USED);
        }

        UrgencyRule newUrgencyRule = new UrgencyRule();

        newUrgencyRule.setRuleCode(ruleCode);
        newUrgencyRule.setDescription(request.description());
        newUrgencyRule.setIsActive(request.isActive());
        newUrgencyRule.setScoreValue(request.scoreValue());
        
        return toResponse(urgencyAdminRepository.save(newUrgencyRule));
    }

    @Transactional
    public UrgencyRuleResponse updateUrgencyRule(Long id, UrgencyRuleUpdateRequest urgencyRuleRequest){
        UrgencyRule urgencyRule = urgencyAdminRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.URGENCY_RULE_NOT_FOUND));

        urgencyRule.setScoreValue(urgencyRuleRequest.scoreValue());
        urgencyRule.setRuleCode(urgencyRuleRequest.ruleCode());
        urgencyRule.setDescription(urgencyRuleRequest.description());
        urgencyRule.setIsActive(urgencyRuleRequest.isActive());
        
        return toResponse(urgencyAdminRepository.save(urgencyRule));
    }

    private UrgencyRuleResponse toResponse(UrgencyRule newUrgencyRule) {
        return new UrgencyRuleResponse(
                newUrgencyRule.getId(),
                newUrgencyRule.getRuleCode(),
                newUrgencyRule.getScoreValue(),
                newUrgencyRule.getDescription(),
                newUrgencyRule.getIsActive()
        );
    }

}
