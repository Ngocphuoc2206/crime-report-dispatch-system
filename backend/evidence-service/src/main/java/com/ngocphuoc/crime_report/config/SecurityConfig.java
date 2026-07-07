package com.ngocphuoc.crime_report.config;

import com.ngocphuoc.crime_report.shared.security.InternalTokenAuthenticationFilter;
import com.ngocphuoc.crime_report.shared.security.JwtAuthenticationFilter;
import com.ngocphuoc.crime_report.shared.security.JwtTokenVerifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.List;

@Configuration
public class SecurityConfig {
    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.internal-token}")
    private String internalToken;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        JwtAuthenticationFilter jwtAuthenticationFilter = new JwtAuthenticationFilter(new JwtTokenVerifier(jwtSecret));
        InternalTokenAuthenticationFilter internalTokenAuthenticationFilter =
                new InternalTokenAuthenticationFilter(internalToken, List.of("/api/internal/**"));

        httpSecurity
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(request -> request
                        .requestMatchers("/api/health", "/api/health/**").permitAll()
                        .requestMatchers("/v3/api-docs", "/v3/api-docs/**", "/swagger-ui.html", "/swagger-ui/**").permitAll()
                        .requestMatchers("/api/public/**").permitAll()
                        .requestMatchers("/api/internal/**").hasRole("INTERNAL_SERVICE")
                        .requestMatchers("/api/officer/**").hasAnyRole("OFFICER", "DISPATCHER", "COMMANDER", "ADMIN")
                        .requestMatchers("/api/commander/**").hasAnyRole("COMMANDER", "ADMIN")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(internalTokenAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return httpSecurity.build();
    }
}
