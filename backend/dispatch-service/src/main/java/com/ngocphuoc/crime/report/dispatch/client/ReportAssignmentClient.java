package com.ngocphuoc.crime.report.dispatch.client;

import com.ngocphuoc.crime.report.dispatch.dto.response.DispatchCandidateResponse;
import com.ngocphuoc.crime.report.dispatch.dto.response.InternalReportLookupResponse;
import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ReportAssignmentClient {
    private static final String INTERNAL_TOKEN_HEADER = "X-Internal-Token";
    private static final String UPDATE_ASSIGNMENT_PATH = "/api/internal/reports/{caseId}/assignment";
    private static final String DISPATCH_CANDIDATES = "/api/internal/reports/dispatch-candidates";
    private static final String REPORT_BY_TRACKING = "/api/internal/reports/tracking/{trackingCode}";
    private static final String DISPATCH_SUMMARY = "/api/internal/reports/{caseId}/dispatch-summary";

    private final RestClient.Builder restClientBuilder;

    @Value("${services.report-url.base-url}")
    private String reportServiceUrl;

    @Value("${app.internal-token}")
    private String internalToken;

    public List<DispatchCandidateResponse> getDispatchCandidates() {
        RestClient restClient = restClientBuilder.build();

        ApiResponse<List<DispatchCandidateResponse>> response = restClient.get()
                .uri(reportServiceUrl + DISPATCH_CANDIDATES)
                .header(INTERNAL_TOKEN_HEADER, internalToken)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});

        return response == null || response.getData() == null ? List.of() : response.getData();
    }

    public InternalReportLookupResponse getReportByTrackingCode(String trackingCode) {
        RestClient restClient = restClientBuilder.build();

        ApiResponse<InternalReportLookupResponse> response = restClient.get()
                .uri(reportServiceUrl + REPORT_BY_TRACKING, trackingCode)
                .header(INTERNAL_TOKEN_HEADER, internalToken)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});

        return response == null ? null : response.getData();
    }

    public DispatchCandidateResponse getDispatchSummary(Long caseId) {
        RestClient restClient = restClientBuilder.build();

        ApiResponse<DispatchCandidateResponse> response = restClient.get()
                .uri(reportServiceUrl + DISPATCH_SUMMARY, caseId)
                .header(INTERNAL_TOKEN_HEADER, internalToken)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});

        return response == null ? null : response.getData();
    }

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
