package com.ngocphuoc.crime_report.evidence.client;

import com.ngocphuoc.crime_report.evidence.dto.ReportApiResponse;
import com.ngocphuoc.crime_report.evidence.dto.ReportLookupResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import static com.ngocphuoc.crime_report.shared.security.InternalTokenAuthenticationFilter.INTERNAL_TOKEN_HEADER;

@Component
@RequiredArgsConstructor
public class ReportClient {
    private final RestClient.Builder restClientBuilder;

    @Value("${services.report.base-url}")
    private String reportBaseUrl;

    @Value("${app.internal-token}")
    private String internalToken;

    public ReportLookupResponse findByTrackingCode(String trackingCode){
        RestClient restClient = restClientBuilder.baseUrl(reportBaseUrl).build();

        ReportApiResponse<ReportLookupResponse> response = restClient
                .get()
                .uri("/api/internal/reports/tracking/{trackingCode}", trackingCode)
                .header(INTERNAL_TOKEN_HEADER, internalToken)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {
                });

        if (response == null || response.data() == null) {
            throw new IllegalStateException("Report service returned empty response");
        }

        return response.data();
    }
}
