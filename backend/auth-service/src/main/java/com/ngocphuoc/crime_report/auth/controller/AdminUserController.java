package com.ngocphuoc.crime_report.auth.controller;

import com.ngocphuoc.crime_report.auth.dto.request.CreateUserRequest;
import com.ngocphuoc.crime_report.auth.dto.request.UpdateUserRolesRequest;
import com.ngocphuoc.crime_report.auth.dto.request.UpdateUserStatusRequest;
import com.ngocphuoc.crime_report.auth.dto.response.AdminUserResponse;
import com.ngocphuoc.crime_report.auth.service.AdminUserService;
import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    public ApiResponse<List<AdminUserResponse>> getUsers() {
        return ApiResponse.<List<AdminUserResponse>>builder()
                .message("Users retrieved successfully")
                .data(adminUserService.getUsers())
                .build();
    }

    @PostMapping
    public ApiResponse<AdminUserResponse> createUser(
            @RequestBody CreateUserRequest request
    ) {
        return ApiResponse.<AdminUserResponse>builder()
                .message("User created successfully")
                .data(adminUserService.createUser(request))
                .build();
    }

    @PatchMapping("/{id}/roles")
    public ApiResponse<AdminUserResponse> updateRoles(
            @PathVariable Long id,
            @RequestBody UpdateUserRolesRequest request
    ) {
        return ApiResponse.<AdminUserResponse>builder()
                .message("User roles updated successfully")
                .data(adminUserService.updateRoles(id, request))
                .build();
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<AdminUserResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody UpdateUserStatusRequest request
    ) {
        return ApiResponse.<AdminUserResponse>builder()
                .message("User status updated successfully")
                .data(adminUserService.updateStatus(id, request))
                .build();
    }
}
