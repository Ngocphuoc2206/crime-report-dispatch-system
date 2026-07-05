package com.ngocphuoc.crime_report.report.entity;

import com.ngocphuoc.crime_report.crimecatalog.entity.CrimeType;
import com.ngocphuoc.crime_report.enums.CaseStatus;
import com.ngocphuoc.crime_report.enums.UrgencyLevel;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "case_report")
public class CaseReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tracking_code", nullable = false, unique = true, length = 50)
    private String trackingCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "crime_type_id", nullable = false)
    private CrimeType crimeType;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "incident_time")
    private LocalDateTime incidentTime;

    @Column(name = "is_happening_now", nullable = false)
    private Boolean isHappeningNow = false;

    @Column(name = "has_weapon", nullable = false)
    private Boolean hasWeapon = false;

    @Column(name = "has_injured_person", nullable = false)
    private Boolean hasInjuredPerson = false;

    @Column(precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(precision = 10, scale = 7)
    private BigDecimal longitude;

    @Column(name = "address_text", columnDefinition = "TEXT")
    private String addressText;

    @Column(name = "urgency_score", nullable = false)
    private Integer urgencyScore = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "urgency_level", nullable = false, length = 50)
    private UrgencyLevel urgencyLevel = UrgencyLevel.LOW;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private CaseStatus status = CaseStatus.NEW_RECEIVED;

    @Column(name = "assigned_unit_id")
    private Long assignedUnitId;

    @Column(name = "assigned_officer_id")
    private Long assignedOfficerId;

    @Column(name = "spam_score", nullable = false)
    private Integer spamScore = 0;

    @Column(name = "spam_level", nullable = false, length = 20)
    private String spamLevel = "NONE";

    @Column(name = "spam_reasons", columnDefinition = "TEXT")
    private String spamReasons;

    @Column(name = "fake_score", nullable = false)
    private Integer fakeScore = 0;

    @Column(name = "ai_confidence", nullable = false)
    private Integer aiConfidence = 0;

    @Column(name = "ai_decision", length = 50)
    private String aiDecision;

    @Column(name = "spam_detection_source", nullable = false, length = 50)
    private String spamDetectionSource = "RULE_BASED";

    @Column(name = "ai_model", length = 100)
    private String aiModel;

    @Column(name = "ai_checked_at")
    private LocalDateTime aiCheckedAt;

    @Column(name = "ai_error", columnDefinition = "TEXT")
    private String aiError;

    @Version
    @Column(nullable = false)
    private Long version;

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false, insertable = false, updatable = false)
    private LocalDateTime updatedAt;
}
