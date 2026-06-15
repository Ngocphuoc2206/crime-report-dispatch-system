package com.ngocphuoc.crime.report.dispatch.client;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
@RequiredArgsConstructor
public class ReportAssignmentClient {
    private static final String INTERNAL_TOKEN_HEADER = "X-Internal-Token";
    private static final String UPDATE_ASSIGNMENT_PATH = "/api/internal/reports/{caseId}/assignment";

    private final RestClient.Builder restClientBuilder;

    @Value("${services.report-url.base-url}")
    private String reportServiceUrl;

    @Value("${app.internal-token}")
    private String internalToken;

    public void updateAssignment(
            Long caseId,
            Long assignedUnitId,
            Long assignedOfficerId
    ) {
        RestClient restClient = restClientBuilder.build();

        restClient.patch()
                .uri(reportServiceUrl + UPDATE_ASSIGNMENT_PATH, caseId)
                .header(INTERNAL_TOKEN_HEADER, internalToken)
                .body(new UpdateReportAssignmentRequest(assignedUnitId, assignedOfficerId))
                .retrieve()
                .toBodilessEntity();
    }

    private record UpdateReportAssignmentRequest(
            Long assignedUnitId,
            Long assignedOfficerId
    ) {
    }
}
