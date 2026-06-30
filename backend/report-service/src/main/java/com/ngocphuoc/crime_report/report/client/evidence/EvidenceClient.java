package com.ngocphuoc.crime_report.report.client.evidence;

import com.ngocphuoc.crime_report.report.dto.response.EvidenceMetadataResponse;
import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class EvidenceClient {
    private static final String INTERNAL_TOKEN = "X-Internal-Token";
    // Evidence-service
    private static final String METADATA_CASE_PATH = "/api/internal/evidences/cases/{caseId}/metadata";
    private static final String INTERNAL_EVIDENCE_PATH = "/api/internal/evidences";

    private final RestClient.Builder restClientBuilder;

    @Value("${services.evidence.base-url}")
    private String evidenceBaseUrl;

    @Value("${app.internal-token}")
    private String internalToken;

    public void uploadEvidence(Long caseId, String trackingCode, List<MultipartFile> files) {
        if (files == null || files.isEmpty()) {
            return;
        }

        LinkedMultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("caseId", caseId);
        body.add("trackingCode", trackingCode);

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

                HttpHeaders partHeaders = new HttpHeaders();
                partHeaders.setContentType(resolveContentType(file.getContentType()));
                body.add("files", new HttpEntity<>(resource, partHeaders));
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
                .uri(INTERNAL_EVIDENCE_PATH)
                .header(INTERNAL_TOKEN, internalToken)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(body)
                .retrieve()
                .toBodilessEntity();
    }

    private MediaType resolveContentType(String contentType) {
        if (contentType == null || contentType.isBlank()) {
            return MediaType.APPLICATION_OCTET_STREAM;
        }

        try {
            return MediaType.parseMediaType(contentType);
        } catch (Exception exception) {
            return MediaType.APPLICATION_OCTET_STREAM;
        }
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
