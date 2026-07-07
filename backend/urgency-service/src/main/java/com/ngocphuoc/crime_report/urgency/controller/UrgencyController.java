package com.ngocphuoc.crime_report.urgency.controller;

import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import com.ngocphuoc.crime_report.urgency.dto.request.UrgencyScoreRequest;
import com.ngocphuoc.crime_report.urgency.dto.response.UrgencyScoreResult;
import com.ngocphuoc.crime_report.urgency.service.UrgencyScoringService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/urgency")
@Tag(name = "Urgency Scoring", description = "Urgency score calculation APIs")
public class UrgencyController {
    private final UrgencyScoringService urgencyScoringService;

    @PostMapping("/score")
    @Operation(summary = "Calculate urgency score", description = "Calculate urgency score and level from crime report indicators.")
    public ApiResponse<UrgencyScoreResult> score(@RequestBody UrgencyScoreRequest request) {
        UrgencyScoreResult result = urgencyScoringService.calculate(
                request.baseScore(),
                request.hasWeapon(),
                request.isHappeningNow(),
                request.hasInjuredPerson(),
                request.hasVideoEvidence()
        );

        return ApiResponse.<UrgencyScoreResult>builder()
                .message("Urgency score calculated successfully")
                .data(result)
                .build();
    }
}
