package com.ngocphuoc.crime_report.report.service;

import com.ngocphuoc.crime_report.crimecatalog.entity.CrimeType;
import com.ngocphuoc.crime_report.report.dto.request.CreateReportRequest;
import com.ngocphuoc.crime_report.report.dto.response.AiSpamDetectionResult;
import com.ngocphuoc.crime_report.report.dto.response.SpamDetectionResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class AiSpamDetectionClient {

    private final RestClient.Builder restClientBuilder;
    private final ObjectMapper objectMapper;

    @Value("${ai.spam-detection.enabled:false}")
    private boolean enabled;

    @Value("${ai.spam-detection.base-url:https://api.openai.com}")
    private String baseUrl;

    @Value("${ai.spam-detection.api-key:}")
    private String apiKey;

    @Value("${ai.spam-detection.model:gpt-4.1}")
    private String model;

    @Value("${ai.spam-detection.timeout-seconds:8}")
    private int timeoutSeconds;

    public AiSpamDetectionResult analyze(
            CreateReportRequest request,
            CrimeType crimeType,
            SpamDetectionResult ruleResult
    ) {
        if (!enabled || apiKey == null || apiKey.isBlank()) {
            return AiSpamDetectionResult.fallback("AI spam detection is disabled");
        }

        try {
            SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
            requestFactory.setConnectTimeout(timeoutSeconds * 1000);
            requestFactory.setReadTimeout(timeoutSeconds * 1000);

            RestClient restClient = restClientBuilder
                    .baseUrl(baseUrl)
                    .requestFactory(requestFactory)
                    .build();

            String prompt = buildPrompt(request, crimeType, ruleResult);

            Map<String, Object> body = Map.of(
                    "model", model,
                    "input", List.of(Map.of(
                            "role", "user",
                            "content", List.of(Map.of(
                                    "type", "input_text",
                                    "text", prompt
                            ))
                    )),
                    "text", Map.of(
                            "format", Map.of(
                                    "type", "json_schema",
                                    "name", "case_report_spam_fake_detection",
                                    "strict", true,
                                    "schema", responseSchema()
                            )
                    )
            );

            String responseBody = restClient.post()
                    .uri("/v1/responses")
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .body(body)
                    .retrieve()
                    .body(String.class);

            AiSpamDetectionResult parsed = parseResponse(responseBody);
            return new AiSpamDetectionResult(
                    parsed.spamScore(),
                    parsed.fakeScore(),
                    parsed.confidence(),
                    parsed.level(),
                    parsed.decision(),
                    parsed.recommendedAction(),
                    parsed.reasons(),
                    model,
                    null
            );

        } catch (Exception exception) {
            log.warn("AI spam detection failed, fallback to rule-based result", exception);
            return AiSpamDetectionResult.fallback("AI provider error: " + exception.getMessage());
        }
    }

    private String buildPrompt(
            CreateReportRequest request,
            CrimeType crimeType,
            SpamDetectionResult ruleResult
    ) {
        return """
                Bạn là bộ phân loại nội bộ cho hệ thống tiếp nhận tin báo tội phạm.
                Nhiệm vụ: đánh giá tin báo có dấu hiệu spam/fake hay không.

                Nguyên tắc:
                - Không kết luận fake chỉ vì tin báo thiếu thông tin.
                - Nếu có dấu hiệu nguy hiểm tức thời, vũ khí, người bị thương thì phải thận trọng, ưu tiên MANUAL_REVIEW
                 hoặc AUTO_DISPATCH.
                - Không dùng thông tin cá nhân người báo để phân loại.
                - Chỉ trả về JSON theo schema.

                Dữ liệu tin báo:
                - Loại tội phạm: %s
                - Mô tả: %s
                - Địa chỉ: %s
                - Đang xảy ra: %s
                - Có vũ khí: %s
                - Có người bị thương: %s
                - Thời gian xảy ra: %s
                - Rule-based spam score: %d
                - Rule-based spam level: %s
                - Rule-based reasons: %s
                """.formatted(
                safe(crimeType.getName()),
                safe(request.description()),
                safe(request.addressText()),
                request.isHappeningNow(),
                request.hasWeapon(),
                request.hasInjuredPerson(),
                request.incidentTime(),
                ruleResult.score(),
                ruleResult.level(),
                ruleResult.reasons()
        );
    }

    private Map<String, Object> responseSchema() {
        return Map.of(
                "type", "object",
                "additionalProperties", false,
                "required", List.of(
                        "spamScore",
                        "fakeScore",
                        "confidence",
                        "level",
                        "decision",
                        "recommendedAction",
                        "reasons"
                ),
                "properties", Map.of(
                        "spamScore", Map.of("type", "integer", "minimum", 0, "maximum", 100),
                        "fakeScore", Map.of("type", "integer", "minimum", 0, "maximum", 100),
                        "confidence", Map.of("type", "integer", "minimum", 0, "maximum", 100),
                        "level", Map.of(
                                "type", "string",
                                "enum", List.of("NONE", "LOW", "MEDIUM", "HIGH")
                        ),
                        "decision", Map.of(
                                "type", "string",
                                "enum", List.of("LEGITIMATE", "SPAM", "FAKE_SUSPECTED", "NEEDS_REVIEW")
                        ),
                        "recommendedAction", Map.of(
                                "type", "string",
                                "enum", List.of("AUTO_DISPATCH", "MANUAL_REVIEW", "BLOCK", "ALLOW_WITH_WARNING")
                        ),
                        "reasons", Map.of(
                                "type", "array",
                                "items", Map.of("type", "string")
                        )
                )
        );
    }

    private AiSpamDetectionResult parseResponse(String responseBody) throws Exception {
        JsonNode root = objectMapper.readTree(responseBody);

        JsonNode output = root.path("output");
        if (!output.isArray() || output.isEmpty()) {
            return AiSpamDetectionResult.fallback("AI response has no output");
        }

        JsonNode content = output.get(0).path("content");
        if (!content.isArray() || content.isEmpty()) {
            return AiSpamDetectionResult.fallback("AI response has no content");
        }

        String jsonText = content.get(0).path("text").asText();
        if (jsonText == null || jsonText.isBlank()) {
            return AiSpamDetectionResult.fallback("AI response text is empty");
        }

        return objectMapper.readValue(jsonText, AiSpamDetectionResult.class);
    }

    private String safe(String value) {
        if (value == null) {
            return "";
        }

        return value.length() > 2000 ? value.substring(0, 2000) : value;
    }
}
