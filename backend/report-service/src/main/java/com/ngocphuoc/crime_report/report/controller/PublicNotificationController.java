package com.ngocphuoc.crime_report.report.controller;

import com.ngocphuoc.crime_report.report.dto.response.PublicProcessingFeedResponse;
import com.ngocphuoc.crime_report.report.service.CaseNotificationService;
import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/public/notifications")
@Tag(name = "Public Notifications", description = "Anonymized public processing updates")
public class PublicNotificationController {
    private final CaseNotificationService caseNotificationService;

    @GetMapping("/processing")
    @Operation(
            summary = "Get anonymized processing updates",
            description = "Return generic dispatch activity without case, location, unit, or officer identifiers.",
            security = {}
    )
    public ApiResponse<PublicProcessingFeedResponse> getProcessingFeed() {
        return ApiResponse.<PublicProcessingFeedResponse>builder()
                .message("Public processing updates retrieved successfully")
                .data(caseNotificationService.getPublicProcessingFeed())
                .build();
    }
}
