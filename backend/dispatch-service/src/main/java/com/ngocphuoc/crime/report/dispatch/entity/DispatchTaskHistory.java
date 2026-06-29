package com.ngocphuoc.crime.report.dispatch.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "dispatch_task_history")
public class DispatchTaskHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dispatch_task_id")
    private DispatchTask dispatchTask;

    @Column(name = "case_id", nullable = false)
    private Long caseId;

    @Column(nullable = false, length = 50)
    private String action;

    @Column(name = "previous_status", length = 50)
    private String previousStatus;

    @Column(name = "next_status", length = 50)
    private String nextStatus;

    @Column(name = "previous_unit_id")
    private Long previousUnitId;

    @Column(name = "previous_officer_id")
    private Long previousOfficerId;

    @Column(name = "assigned_unit_id")
    private Long assignedUnitId;

    @Column(name = "assigned_officer_id")
    private Long assignedOfficerId;

    @Column(length = 500)
    private String reason;

    @Column(length = 100)
    private String actor;

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
