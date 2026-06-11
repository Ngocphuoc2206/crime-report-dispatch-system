package com.ngocphuoc.crime_report.shared.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

public class InternalTokenAuthenticationFilter extends OncePerRequestFilter {
    public static final String INTERNAL_TOKEN_HEADER = "X-Internal-Token";

    private final String internalToken;
    private final List<String> protectedPatterns;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    public InternalTokenAuthenticationFilter(String internalToken, List<String> protectedPatterns) {
        this.internalToken = internalToken;
        this.protectedPatterns = protectedPatterns;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        if (isProtectedInternalPath(request)
                && internalToken != null
                && !internalToken.isBlank()
                && internalToken.equals(request.getHeader(INTERNAL_TOKEN_HEADER))
                && SecurityContextHolder.getContext().getAuthentication() == null) {
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    "internal-service",
                    null,
                    List.of(new SimpleGrantedAuthority("ROLE_INTERNAL_SERVICE"))
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }

    private boolean isProtectedInternalPath(HttpServletRequest request) {
        String path = request.getRequestURI();
        return protectedPatterns.stream().anyMatch(pattern -> pathMatcher.match(pattern, path));
    }
}
