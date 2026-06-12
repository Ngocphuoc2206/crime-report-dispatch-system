package com.ngocphuoc.crime.report.dispatch.entity;

import com.ngocphuoc.crime.report.dispatch.enums.AvailabilityStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(
        name = "duty_assignment",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_duty_assignment_shift_officer",
                        columnNames = {"shift_id", "officer_id"}
                )
        }
)
public class DutyAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shift_id", nullable = false)
    private DutyShift shift;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "officer_id", nullable = false)
    private Officer officer;

    @Enumerated(EnumType.STRING)
    @Column(name = "availability_status", nullable = false, length = 50)
    private AvailabilityStatus availabilityStatus = AvailabilityStatus.AVAILABLE;

    @Column(name = "current_case_id")
    private Long currentCaseId;

    @Column(length = 255)
    private String note;

    @Column(name = "last_status_at", nullable = false, insertable = false)
    private LocalDateTime lastStatusAt;

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false, insertable = false, updatable = false)
    private LocalDateTime updatedAt;
}
