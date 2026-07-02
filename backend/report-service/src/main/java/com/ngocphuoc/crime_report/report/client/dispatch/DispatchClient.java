package com.ngocphuoc.crime_report.report.client.dispatch;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ngocphuoc.crime_report.report.dto.response.OfficerProfileResponse;
import com.ngocphuoc.crime_report.report.dto.response.SmartDispatchResponse;
import com.ngocphuoc.crime_report.shared.exception.AppException;
import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.Objects;

@Component
@RequiredArgsConstructor
@Slf4j
public class DispatchClient {
    private static final String INTERNAL_TOKEN_HEADER = "X-Internal-Token";
    private static final String SMART_DISPATCH_PATH = "/api/dispatch/smart-dispatch";
    private static final String OFFICER_BY_USER_ID = "/api/internal/officers/by-user/{userId}";
    private static final String COMPLETE_DISPATCH_BY_CASE_PATH = "/api/dispatch/tasks/by-case/{caseId}/complete";

    private final RestClient.Builder restClientBuilder;
    private final ObjectMapper objectMapper = new ObjectMapper();

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

    public SmartDispatchResponse smartDispatch(
            Long caseId,
            BigDecimal latitude,
            BigDecimal longitude
    ) {
        RestClient restClient = restClientBuilder.build();

        // get log service if services was error
        ApiResponse<SmartDispatchResponse> response = restClient.post()
                .uri(dispatchServiceUrl + SMART_DISPATCH_PATH)
                .header(INTERNAL_TOKEN_HEADER, internalToken)
                .body(new SmartDispatchRequest(caseId, latitude, longitude, false))
                .retrieve()
                .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                        (request, responseError) -> {
                            try {
                                ApiResponse<?> errorResponse = objectMapper.readValue(
                                        responseError.getBody(),
                                        new TypeReference<>() {}
                                );
                                throw new AppException(errorResponse.getErrorCode(), errorResponse.getMessage());
                            } catch (IOException exception) {
                                throw new AppException(
                                        "DISPATCH_SERVICE_ERROR",
                                        "Dispatch service error: " + responseError.getStatusCode()
                                );
                            }
                        })
                .body(new ParameterizedTypeReference<>() {});

        return Objects.requireNonNull(response).getData();
    }

    public void completeDispatchForCase(Long caseId, String note) {
        RestClient restClient = restClientBuilder.build();

        try {
            restClient.patch()
                    .uri(dispatchServiceUrl + COMPLETE_DISPATCH_BY_CASE_PATH, caseId)
                    .header(INTERNAL_TOKEN_HEADER, internalToken)
                    .body(new CompleteDispatchRequest("COMPLETED", note))
                    .retrieve()
                    .body(new ParameterizedTypeReference<ApiResponse<Object>>() {});
        } catch (RestClientException exception) {
            log.warn("Could not complete dispatch task for caseId={}", caseId, exception);
        }
    }

    private record SmartDispatchRequest(
            Long caseId,
            BigDecimal incidentLatitude,
            BigDecimal incidentLongitude,
            Boolean updateReportAssignment
    ) {
    }

    private record CompleteDispatchRequest(
            String status,
            String note
    ) {
    }
}
