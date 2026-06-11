package com.ngocphuoc.crime_report.shared.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

public class JwtTokenVerifier {
    private final SecretKey signingKey;

    public JwtTokenVerifier(String jwtSecret) {
        this.signingKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public JwtPrincipal verify(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return new JwtPrincipal(claims.getSubject(), extractRoles(claims));
    }

    private List<String> extractRoles(Claims claims) {
        Object rolesClaim = claims.get("roles");
        if (!(rolesClaim instanceof List<?> roles)) {
            return List.of();
        }

        List<String> normalizedRoles = new ArrayList<>();
        for (Object role : roles) {
            if (role != null) {
                normalizedRoles.add(role.toString());
            }
        }
        return normalizedRoles;
    }
}
