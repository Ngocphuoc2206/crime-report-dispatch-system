package com.ngocphuoc.crime_report.auth.service;

import com.ngocphuoc.crime_report.auth.dto.request.CreateUserRequest;
import com.ngocphuoc.crime_report.auth.dto.request.UpdateUserRolesRequest;
import com.ngocphuoc.crime_report.auth.dto.request.UpdateUserStatusRequest;
import com.ngocphuoc.crime_report.auth.dto.response.AdminUserResponse;
import com.ngocphuoc.crime_report.auth.entity.Role;
import com.ngocphuoc.crime_report.auth.entity.User;
import com.ngocphuoc.crime_report.auth.repository.RoleRepository;
import com.ngocphuoc.crime_report.auth.repository.UserRepository;
import com.ngocphuoc.crime_report.common.ErrorCode;
import com.ngocphuoc.crime_report.shared.exception.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminUserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public List<AdminUserResponse> getUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public AdminUserResponse createUser(CreateUserRequest createUserRequest){
        String username = createUserRequest.username().trim();

        if (userRepository.existsByEmailIgnoreCase(username)) {
            throw new AppException(ErrorCode.USER_ALREADY_EXISTS);
        }

        if (createUserRequest.email() != null
                && userRepository.existsByEmailIgnoreCase(createUserRequest.email().trim())) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        Set<Role> roles = resolveRoles(createUserRequest.roles());

        User user = new User();
        user.setUsername(username);
        user.setPasswordHash(passwordEncoder.encode(createUserRequest.password()));
        user.setFullName(createUserRequest.fullName().trim());
        user.setEmail(createUserRequest.email() == null ? null : createUserRequest.email().trim());
        user.setPhone(createUserRequest.phone());
        user.setIsActive(true);
        user.setRoles(roles);

        return toResponse(userRepository.save(user));
    }

    @Transactional
    public AdminUserResponse updateRoles(
            Long userId,
            UpdateUserRolesRequest request
    ) {
        User user = getUser(userId);
        user.setRoles(resolveRoles(request.roles()));
        return toResponse(user);
    }

    @Transactional
    public AdminUserResponse updateStatus(
            Long userId,
            UpdateUserStatusRequest request
    ) {
        User user = getUser(userId);
        user.setIsActive(request.active());
        return toResponse(user);
    }

    private User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    private Set<Role> resolveRoles(Set<String> requestedRoles) {
        Set<String> names = requestedRoles.stream()
                .map(String::trim)
                .map(name -> name.toUpperCase(Locale.ROOT))
                .collect(Collectors.toSet());

        Set<Role> roles = new HashSet<>(roleRepository.findByNameIn(names));

        if (roles.size() != names.size()) {
            throw new AppException(ErrorCode.ROLE_NOT_FOUND);
        }

        return roles;
    }

    private AdminUserResponse toResponse(User user) {
        Set<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        return new AdminUserResponse(
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getIsActive(),
                roles,
                user.getCreatedAt()
        );
    }
}
