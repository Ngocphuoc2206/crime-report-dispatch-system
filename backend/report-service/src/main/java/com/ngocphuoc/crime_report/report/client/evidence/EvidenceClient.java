package com.ngocphuoc.crime_report.report.client.evidence;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
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
public class EvidenceClient {
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
                .uri("/api/internal/reports/{trackingCode}/evidences", trackingCode)
                .header(INTERNAL_TOKEN_HEADER, internalToken)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(body)
                .retrieve()
                .toBodilessEntity();
    }
}