package com.ngocphuoc.crime_report.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    private static final String[] PUBLIC_ENDPOINTS = {
            "/api/v1/users",
            "/api/v1/auth/login",
            "/api/v1/auth/introspect",
            "/api/v1/auth/logout",
            "/api/v1/auth/refresh",
            "/actuator/health",
            "/actuator/health/**",
            "/api/v1/schedules",
            "/api/v1/routes/*/schedule",
            "/api/v1/live/**"
    };

    private static final String[] PUBLIC_GET_ENDPOINTS = {
            "/api/health",
            "/api/health/**",
            "/api/health/db"
    };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(request -> request
                .requestMatchers( PUBLIC_ENDPOINTS).permitAll()
                .requestMatchers(PUBLIC_GET_ENDPOINTS).permitAll()
                .anyRequest().authenticated()

        );
        return httpSecurity.build();
    }
}
