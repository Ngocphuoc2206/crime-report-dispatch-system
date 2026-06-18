package com.ngocphuoc.crime_report.report.entity;

import com.ngocphuoc.crime_report.enums.CaseLockStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "case_lock")
public class CaseLock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "case_id", nullable = false, unique = true)
    private Long caseId;

    @Column(name = "locked_by_user_id", nullable = false)
    private Long lockedByUserId;

    @Column(name = "locked_by_officer_id", nullable = false)
    private Long lockedByOfficerId;

    @Column(name = "locked_by_unit_id", nullable = false)
    private Long lockedByUnitId;

    @Enumerated(EnumType.STRING)
    @Column(name = "lock_status", nullable = false, length = 50)
    private CaseLockStatus lockStatus = CaseLockStatus.ACTIVE;

    @Column(name = "locked_at", nullable = false)
    private LocalDateTime lockedAt;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "released_at")
    private LocalDateTime releasedAt;

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false, insertable = false, updatable = false)
    private LocalDateTime updatedAt;
}
