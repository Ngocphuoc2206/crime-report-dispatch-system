package com.ngocphuoc.crime_report.report.service;

import com.ngocphuoc.crime_report.enums.CaseStatus;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;

@Service
@AllArgsConstructor
@Slf4j
public class CaseStatusStateMachine {
    private static final Map<CaseStatus, Set<CaseStatus>> ALLOWED_TRANSITIONS = Map.of(
            CaseStatus.NEW_RECEIVED,
            Set.of(
                    CaseStatus.UNDER_VERIFICATION,
                    CaseStatus.SPAM_OR_FAKE
                    ),

            CaseStatus.UNDER_VERIFICATION,
            Set.of(
                    CaseStatus.TRANSFERRED_TO_INVESTIGATION,
                    CaseStatus.RESOLVED,
                    CaseStatus.SPAM_OR_FAKE
            ),
            CaseStatus.TRANSFERRED_TO_INVESTIGATION,
            Set.of(CaseStatus.RESOLVED),
            CaseStatus.RESOLVED,
            Set.of(),

            CaseStatus.SPAM_OR_FAKE,
            Set.of()
    );

    public boolean canTransition(CaseStatus from, CaseStatus to){
        if (from == null || to == null){
            return false;
        }
        if (from == to){
            return false;
        }

        return ALLOWED_TRANSITIONS.getOrDefault(from, Set.of()).contains(to);
    }
}
