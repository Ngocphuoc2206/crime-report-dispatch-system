package com.ngocphuoc.crime_report.controller;

import com.ngocphuoc.crime_report.common.ApiResponse;
import com.ngocphuoc.crime_report.dto.request.LoginRequest;
import com.ngocphuoc.crime_report.dto.response.LoginResponse;
import com.ngocphuoc.crime_report.service.AuthenticationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationService authenticationService;

    public AuthController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {
        LoginResponse response = authenticationService.login(request);

        return ApiResponse.<LoginResponse>builder()
                .message("Login successfully")
                .results(response)
                .build();
    }
}