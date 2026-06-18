package com.ngocphuoc.crime_report.report.client.evidence;

import com.ngocphuoc.crime_report.report.dto.response.EvidenceMetadataResponse;
import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import static com.ngocphuoc.crime_report.shared.security.InternalTokenAuthenticationFilter.INTERNAL_TOKEN_HEADER;

@Component
@RequiredArgsConstructor
@Slf4j
public class EvidenceClient {
    private static final String INTERNAL_TOKEN = "X-Internal-Token";
    // Evidence-service
    private static final String METADATA_CASE_PATH = "/api/internal/evidences/cases/{caseId}/metadata";
    // Report-service
    private static final String TRACKING_EVIDENCE_CODE_PATH = "/api/internal/reports/{trackingCode}/evidences";

    private final RestClient.Builder restClientBuilder;

    @Value("${services.evidence.base-url}")
    private String evidenceBaseUrl;

    @Value("${app.internal-token}")
    private String internalToken;

    public void uploadEvidence(String trackingCode, List<MultipartFile> files) {
        if (files == null || files.isEmpty()) {
            return;
        }

        LinkedMultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

        for (MultipartFile file : files) {
            if (file == null || file.isEmpty()) {
                continue;
            }

            try {
                ByteArrayResource resource = new ByteArrayResource(file.getBytes()) {
                    @Override
                    public String getFilename() {
                        return file.getOriginalFilename();
                    }
                };

                body.add("files", resource);
            } catch (Exception exception) {
                throw new IllegalStateException("Failed to read evidence file", exception);
            }
        }

        if (body.isEmpty()) {
            return;
        }

        restClientBuilder
                .baseUrl(evidenceBaseUrl)
                .build()
                .post()
                .uri(TRACKING_EVIDENCE_CODE_PATH, trackingCode)
                .header(INTERNAL_TOKEN, internalToken)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(body)
                .retrieve()
                .toBodilessEntity();
    }

    public List<EvidenceMetadataResponse> getEvidenceMetadataByCaseId(Long caseId){
        RestClient restClient = restClientBuilder.build();

        ApiResponse<List<EvidenceMetadataResponse>> response = restClient.get()
                .uri(evidenceBaseUrl + METADATA_CASE_PATH, caseId)
                .header(INTERNAL_TOKEN, internalToken)
                .retrieve()
                .body(new ParameterizedTypeReference<>(){
                });

        if (response == null || response.getData() == null){
            return List.of();
        }
        return response.getData();
    }
}