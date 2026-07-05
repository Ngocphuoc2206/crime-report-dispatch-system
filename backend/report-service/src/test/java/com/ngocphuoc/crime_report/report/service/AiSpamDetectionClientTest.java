package com.ngocphuoc.crime_report.report.service;

import com.ngocphuoc.crime_report.report.dto.response.AiSpamDetectionResult;
import org.junit.jupiter.api.Test;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.ObjectMapper;

import java.lang.reflect.Method;

import static org.junit.jupiter.api.Assertions.assertEquals;

class AiSpamDetectionClientTest {

    @Test
    void parseResponse_shouldReadMessageOutputText_whenReasoningComesFirst() throws Exception {
        AiSpamDetectionClient client = new AiSpamDetectionClient(
                RestClient.builder(),
                new ObjectMapper()
        );
        Method parseResponse = AiSpamDetectionClient.class
                .getDeclaredMethod("parseResponse", String.class);
        parseResponse.setAccessible(true);

        String responseBody = """
                {
                  "output": [
                    {
                      "type": "reasoning",
                      "content": [
                        {
                          "type": "reasoning_text",
                          "text": "Internal reasoning text is not the final JSON."
                        }
                      ]
                    },
                    {
                      "type": "message",
                      "content": [
                        {
                          "type": "output_text",
                          "text": "{\\"spamScore\\":12,\\"fakeScore\\":8,\\"confidence\\":90,\\"level\\":\\"LOW\\",\\"decision\\":\\"LEGITIMATE\\",\\"recommendedAction\\":\\"AUTO_DISPATCH\\",\\"reasons\\":[\\"Looks consistent\\"]}"
                        }
                      ]
                    }
                  ]
                }
                """;

        AiSpamDetectionResult result =
                (AiSpamDetectionResult) parseResponse.invoke(client, responseBody);

        assertEquals(12, result.spamScore());
        assertEquals(8, result.fakeScore());
        assertEquals(90, result.confidence());
        assertEquals("LOW", result.level());
        assertEquals("LEGITIMATE", result.decision());
        assertEquals("AUTO_DISPATCH", result.recommendedAction());
        assertEquals("Looks consistent", result.reasons().getFirst());
    }
}
