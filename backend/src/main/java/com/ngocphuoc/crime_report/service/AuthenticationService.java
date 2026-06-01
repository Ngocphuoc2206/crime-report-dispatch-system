package com.ngocphuoc.crime_report.service;

import com.ngocphuoc.crime_report.common.ErrorCode;
import com.ngocphuoc.crime_report.dto.request.LoginRequest;
import com.ngocphuoc.crime_report.dto.response.AuthUserResponse;
import com.ngocphuoc.crime_report.dto.response.LoginResponse;
import com.ngocphuoc.crime_report.entity.Role;
import com.ngocphuoc.crime_report.entity.User;
import com.ngocphuoc.crime_report.exception.AppException;
import com.ngocphuoc.crime_report.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthenticationService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public AuthenticationService(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            JwtService jwtService
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request){
        // Core spring security authentication users
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                request.username(),
                request.password()
        ));

        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));


        List<String> roles = user.getRoles().stream().map(Role::getName).toList();

        String accessToken = jwtService.generateToken(user.getUsername(), roles);

        AuthUserResponse userResponse = new AuthUserResponse(
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                roles
        );

        return new LoginResponse(
                accessToken,
                "Bearer",
                userResponse
        );
    }
}
