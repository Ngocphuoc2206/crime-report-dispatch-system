package com.ngocphuoc.crime.report.dispatch.entity;

import com.ngocphuoc.crime.report.dispatch.enums.DispatchStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "dispatch_task")
public class DispatchTask {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "case_id", nullable = false)
    private Long caseId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_unit_id", nullable = false)
    private PoliceUnit assignedUnit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_officer_id", nullable = false)
    private Officer assignedOfficer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "duty_assignment_id", nullable = false)
    private DutyAssignment dutyAssignment;

    @Column(name = "incident_latitude", nullable = false, precision = 10, scale = 7)
    private BigDecimal incidentLatitude;

    @Column(name = "incident_longitude", nullable = false, precision = 10, scale = 7)
    private BigDecimal incidentLongitude;

    @Column(name = "distance_km", nullable = false, precision = 10, scale = 3)
    private BigDecimal distanceKm;

    @Enumerated(EnumType.STRING)
    @Column(name = "dispatch_status", nullable = false, length = 50)
    private DispatchStatus dispatchStatus = DispatchStatus.ASSIGNED;

    @Column(name = "failure_reason", length = 500)
    private String failureReason;

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false, insertable = false, updatable = false)
    private LocalDateTime updatedAt;
}
