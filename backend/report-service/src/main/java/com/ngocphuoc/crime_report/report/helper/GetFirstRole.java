package com.ngocphuoc.crime_report.report.helper;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

@Service
public class GetFirstRole {
    public String getFirstRole(Authentication authentication){
        return authentication.getAuthorities()
                .stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse(null);
    }
}
