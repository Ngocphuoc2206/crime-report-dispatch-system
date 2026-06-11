package com.ngocphuoc.crime.report.dispatch.entity;

import com.ngocphuoc.crime.report.dispatch.enums.OfficerStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "officer")
public class Officer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unit_id", nullable = false)
    private PoliceUnit unit;

    @Column(name = "badge_number", nullable = false, unique = true, length = 50)
    private String badgeNumber;

    @Column(name = "rank_name", length = 100)
    private String rankName;

    @Enumerated(EnumType.STRING)
    @Column(name = "officer_status", nullable = false, length = 50)
    private OfficerStatus officerStatus = OfficerStatus.ACTIVE;

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false, insertable = false, updatable = false)
    private LocalDateTime updatedAt;
}
