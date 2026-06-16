package com.ngocphuoc.crime_report.report.client.dispatch;

import com.ngocphuoc.crime_report.report.dto.response.OfficerProfileResponse;
import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.util.Objects;

@Component
@RequiredArgsConstructor
public class DispatchClient {
    private static final String INTERNAL_TOKEN_HEADER = "X-Internal-Token";
    private static final String SMART_DISPATCH_PATH = "/api/dispatch/smart-dispatch";
    private static final String OFFICER_BY_USER_ID = "/api/internal/officers/by-user/{userId}";

    private final RestClient.Builder restClientBuilder;

    @Value("${services.dispatch.base-url}")
    private String dispatchServiceUrl;

    @Value("${app.internal-token}")
    private String internalToken;

    public OfficerProfileResponse getOfficerByUserId(Long userId){
        RestClient restClient = restClientBuilder.build();

        ApiResponse<OfficerProfileResponse> response = restClient.get()
                .uri(dispatchServiceUrl + OFFICER_BY_USER_ID, userId)
                .header(INTERNAL_TOKEN_HEADER, internalToken)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});

        return Objects.requireNonNull(response).getData();
    }

    public void smartDispatch(
            Long caseId,
            BigDecimal latitude,
            BigDecimal longitude
    ) {
        RestClient restClient = restClientBuilder.build();

        restClient.post()
                .uri(dispatchServiceUrl + SMART_DISPATCH_PATH)
                .header(INTERNAL_TOKEN_HEADER, internalToken)
                .body(new SmartDispatchRequest(caseId, latitude, longitude))
                .retrieve()
                .toBodilessEntity();
    }

    private record SmartDispatchRequest(
            Long caseId,
            BigDecimal incidentLatitude,
            BigDecimal incidentLongitude
    ) {
    }
}
