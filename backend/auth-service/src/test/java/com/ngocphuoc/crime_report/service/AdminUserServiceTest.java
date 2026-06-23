package com.ngocphuoc.crime_report.auth.service;

import com.ngocphuoc.crime_report.auth.dto.request.CreateUserRequest;
import com.ngocphuoc.crime_report.auth.dto.response.AdminUserResponse;
import com.ngocphuoc.crime_report.auth.entity.Role;
import com.ngocphuoc.crime_report.auth.entity.User;
import com.ngocphuoc.crime_report.auth.repository.RoleRepository;
import com.ngocphuoc.crime_report.auth.repository.UserRepository;
import com.ngocphuoc.crime_report.common.ErrorCode;
import com.ngocphuoc.crime_report.shared.exception.AppException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminUserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AdminUserService adminUserService;

    @Test
    void createUser_shouldCreateUser_whenRequestIsValid() {
        // Arrange
        CreateUserRequest request = new CreateUserRequest(
                " officer02 ",
                "password123",
                " Nguyễn Văn A ",
                " officer02@example.com ",
                "0900000002",
                Set.of(" officer ")
        );

        Role officerRole = new Role();
        officerRole.setId(2L);
        officerRole.setName("OFFICER");

        when(userRepository.existsByUsernameIgnoreCase("officer02"))
                .thenReturn(false);

        when(userRepository.existsByEmailIgnoreCase(
                "officer02@example.com"
        )).thenReturn(false);

        when(roleRepository.findByNameIn(Set.of("OFFICER")))
                .thenReturn(List.of(officerRole));

        when(passwordEncoder.encode("password123"))
                .thenReturn("encoded-password");

        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> {
                    User user = invocation.getArgument(0);
                    user.setId(10L);
                    return user;
                });

        // Act
        AdminUserResponse response =
                adminUserService.createUser(request);

        // Assert response
        assertNotNull(response);
        assertEquals(10L, response.id());
        assertEquals("officer02", response.username());
        assertEquals("Nguyễn Văn A", response.fullName());
        assertEquals("officer02@example.com", response.email());
        assertTrue(response.active());
        assertEquals(Set.of("OFFICER"), response.roles());

        // Assert entity được lưu
        ArgumentCaptor<User> captor =
                ArgumentCaptor.forClass(User.class);

        verify(userRepository).save(captor.capture());

        User savedUser = captor.getValue();

        assertEquals("officer02", savedUser.getUsername());
        assertEquals("encoded-password", savedUser.getPasswordHash());
        assertEquals("Nguyễn Văn A", savedUser.getFullName());
        assertEquals("officer02@example.com", savedUser.getEmail());
        assertEquals("0900000002", savedUser.getPhone());
        assertTrue(savedUser.getIsActive());
        assertEquals(Set.of(officerRole), savedUser.getRoles());

        verify(passwordEncoder).encode("password123");
    }

    @Test
    void createUser_shouldThrowException_whenUsernameExists() {
        // Arrange
        CreateUserRequest request = validRequest();

        when(userRepository.existsByUsernameIgnoreCase("officer02"))
                .thenReturn(true);

        // Act
        AppException exception = assertThrows(
                AppException.class,
                () -> adminUserService.createUser(request)
        );

        // Assert
        assertEquals(
                ErrorCode.USER_ALREADY_EXISTS,
                exception.getErrorCode()
        );

        verify(userRepository, never()).save(any());
        verifyNoInteractions(roleRepository);
        verifyNoInteractions(passwordEncoder);
    }

    @Test
    void createUser_shouldThrowException_whenEmailExists() {
        // Arrange
        CreateUserRequest request = validRequest();

        when(userRepository.existsByEmailIgnoreCase(
                "officer02@example.com"
        )).thenReturn(true);

        // Act
        AppException exception = assertThrows(
                AppException.class,
                () -> adminUserService.createUser(request)
        );

        // Assert
        assertEquals(
                ErrorCode.EMAIL_ALREADY_EXISTS,
                exception.getErrorCode()
        );

        verify(userRepository, never()).save(any());
        verifyNoInteractions(roleRepository);
        verifyNoInteractions(passwordEncoder);
    }

    @Test
    void createUser_shouldThrowException_whenRoleDoesNotExist() {
        // Arrange
        CreateUserRequest request = validRequest();

        when(roleRepository.findByNameIn(Set.of("OFFICER")))
                .thenReturn(List.of());

        // Act
        AppException exception = assertThrows(
                AppException.class,
                () -> adminUserService.createUser(request)
        );

        // Assert
        assertEquals(
                ErrorCode.ROLE_NOT_FOUND,
                exception.getErrorCode()
        );

        verify(userRepository, never()).save(any());
        verifyNoInteractions(passwordEncoder);
    }

    private CreateUserRequest validRequest() {
        return new CreateUserRequest(
                "officer02",
                "password123",
                "Nguyễn Văn A",
                "officer02@example.com",
                "0900000002",
                Set.of("OFFICER")
        );
    }
}