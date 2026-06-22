package com.ngocphuoc.crime_report.gateway;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Collections;
import java.util.List;

@RestController
public class ProxyController {
    private static final String X_FORWARDED_FOR = "X-Forwarded-For";
    private static final List<String> HOP_BY_HOP_HEADERS = List.of(
            "connection",
            "content-length",
            "expect",
            "host",
            "transfer-encoding"
    );

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5))
            .build();

    @Value("${services.auth-url}")
    private String authServiceUrl;

    @Value("${services.report-url}")
    private String reportServiceUrl;

    @Value("${services.evidence-url}")
    private String evidenceServiceUrl;

    @Value("${services.urgency-url}")
    private String urgencyServiceUrl;

    @Value("${services.dispatch-url}")
    private String dispatchServiceUrl;

    @RequestMapping("/api/auth/**")
    public ResponseEntity<byte[]> auth(HttpServletRequest request) throws Exception {
        return forward(request, authServiceUrl);
    }

    @RequestMapping({
            "/api/public/reports",
            "/api/public/reports/{trackingCode}/status",
            "/api/public/crime-types",

            "/api/officer/reports/**",
            "/api/officer/cases",
            "/api/officer/cases/**",

            "/api/admin/crime-types",
            "/api/admin/crime-types/**",

            "/api/internal/reports/**"
    })
    public ResponseEntity<byte[]> reports(HttpServletRequest request) throws Exception {
        return forward(request, reportServiceUrl);
    }

    @RequestMapping({
            "/api/public/reports/*/evidences",
            "/api/officer/evidences/**",
    })
    public ResponseEntity<byte[]> evidences(HttpServletRequest request) throws Exception {
        return forward(request, evidenceServiceUrl);
    }

    @RequestMapping("/api/urgency/**")
    public ResponseEntity<byte[]> urgency(HttpServletRequest request) throws Exception {
        return forward(request, urgencyServiceUrl);
    }

    @RequestMapping("/api/dispatch/**")
    public ResponseEntity<byte[]> dispatch(HttpServletRequest request) throws Exception{
        return forward(request, dispatchServiceUrl);
    }

    @RequestMapping({
            "/api/health",
            "/api/health/**"
    })
    public ResponseEntity<byte[]> health(HttpServletRequest request) throws Exception {
        return forward(request, reportServiceUrl);
    }

    private ResponseEntity<byte[]> forward(HttpServletRequest request, String targetBaseUrl) throws Exception {
        byte[] body = StreamUtils.copyToByteArray(request.getInputStream());
        HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()
                .uri(buildTargetUri(request, targetBaseUrl))
                .timeout(Duration.ofSeconds(30));

        Collections.list(request.getHeaderNames()).forEach(headerName -> {
            if (!HOP_BY_HOP_HEADERS.contains(headerName.toLowerCase())
                    && !X_FORWARDED_FOR.equalsIgnoreCase(headerName)) {
                Collections.list(request.getHeaders(headerName))
                        .forEach(headerValue -> requestBuilder.header(headerName, headerValue));
            }
        });

        requestBuilder.header(X_FORWARDED_FOR, request.getRemoteAddr());

        requestBuilder.method(
                request.getMethod(),
                body.length == 0
                        ? HttpRequest.BodyPublishers.noBody()
                        : HttpRequest.BodyPublishers.ofByteArray(body)
        );

        HttpResponse<byte[]> response = httpClient.send(requestBuilder.build(), HttpResponse.BodyHandlers.ofByteArray());

        HttpHeaders responseHeaders = new HttpHeaders();
        response.headers().map().forEach((name, values) -> {
            if (!HOP_BY_HOP_HEADERS.contains(name.toLowerCase())) {
                responseHeaders.put(name, values);
            }
        });

        return new ResponseEntity<>(
                response.body(),
                responseHeaders,
                HttpStatusCode.valueOf(response.statusCode())
        );
    }

    private URI buildTargetUri(HttpServletRequest request, String targetBaseUrl) {
        String queryString = request.getQueryString();
        String requestUri = request.getRequestURI();
        String target = targetBaseUrl + requestUri + (queryString == null ? "" : "?" + queryString);
        return URI.create(target.replace(" ", "%20"));
    }
}
