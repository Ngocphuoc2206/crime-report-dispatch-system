package com.ngocphuoc.crime_report.auth.dto.request;

import java.util.Set;

public record UpdateUserRolesRequest(
        Set<String> roles
) {
}
