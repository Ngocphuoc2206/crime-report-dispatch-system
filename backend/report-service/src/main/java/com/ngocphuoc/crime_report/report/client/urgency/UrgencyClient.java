package com.ngocphuoc.crime_report.report.client.urgency;

import com.ngocphuoc.crime_report.report.dto.request.UrgencyScoreRequest;
import com.ngocphuoc.crime_report.report.dto.response.UrgencyApiResponse;
import com.ngocphuoc.crime_report.report.dto.response.UrgencyScoreResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import static com.ngocphuoc.crime_report.shared.security.InternalTokenAuthenticationFilter.INTERNAL_TOKEN_HEADER;

@Component
@RequiredArgsConstructor
public class UrgencyClient {
    private final RestClient.Builder restClientBuilder;

    @Value("${services.urgency.base-url}")
    private String urgencyBaseUrl;

    @Value("${app.internal-token}")
    private String internalToken;

    public UrgencyScoreResponse calculateScore(UrgencyScoreRequest request){
        RestClient restClient = restClientBuilder.baseUrl(urgencyBaseUrl).build();

        UrgencyApiResponse<UrgencyScoreResponse> response =
                restClient.post()
                        .uri("/api/urgency/score")
                        .header(INTERNAL_TOKEN_HEADER, internalToken)
                        .body(request)
                        .retrieve()
                        .body(new ParameterizedTypeReference<>() {
        });

        if (response == null || response.data() == null) {
            throw new IllegalStateException("Urgency service returned empty response");
        }

        return response.data();
    }
}
