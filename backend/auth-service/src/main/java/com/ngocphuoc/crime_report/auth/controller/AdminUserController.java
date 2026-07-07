package com.ngocphuoc.crime_report.auth.controller;

import com.ngocphuoc.crime_report.auth.dto.request.CreateUserRequest;
import com.ngocphuoc.crime_report.auth.dto.request.UpdateUserRolesRequest;
import com.ngocphuoc.crime_report.auth.dto.request.UpdateUserStatusRequest;
import com.ngocphuoc.crime_report.auth.dto.response.AdminUserResponse;
import com.ngocphuoc.crime_report.auth.service.AdminUserService;
import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/users")
@Tag(name = "Admin Management User", description = "Admin quản lý người dùng")
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    @Operation(summary = "List users", description = "Return all user accounts for administration.")
    public ApiResponse<List<AdminUserResponse>> getUsers() {
        return ApiResponse.<List<AdminUserResponse>>builder()
                .message("Users retrieved successfully")
                .data(adminUserService.getUsers())
                .build();
    }

    @PostMapping
    @Operation(summary = "Create user", description = "Create a new system user with roles and active status.")
    public ApiResponse<AdminUserResponse> createUser(
            @Valid @RequestBody CreateUserRequest request
    ) {
        return ApiResponse.<AdminUserResponse>builder()
                .message("User created successfully")
                .data(adminUserService.createUser(request))
                .build();
    }

    @PatchMapping("/{id}/roles")
    @Operation(summary = "Update user roles", description = "Replace roles assigned to a user.")
    public ApiResponse<AdminUserResponse> updateRoles(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRolesRequest request
    ) {
        return ApiResponse.<AdminUserResponse>builder()
                .message("User roles updated successfully")
                .data(adminUserService.updateRoles(id, request))
                .build();
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update user status", description = "Activate or deactivate a user account.")
    public ApiResponse<AdminUserResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserStatusRequest request
    ) {
        return ApiResponse.<AdminUserResponse>builder()
                .message("User status updated successfully")
                .data(adminUserService.updateStatus(id, request))
                .build();
    }
}
