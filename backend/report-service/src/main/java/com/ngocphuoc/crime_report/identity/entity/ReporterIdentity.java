package com.ngocphuoc.crime_report.identity.entity;

import com.ngocphuoc.crime_report.report.entity.CaseReport;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "reporter_identity")
public class ReporterIdentity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_id", nullable = false, unique = true)
    private CaseReport caseReport;

    @Column(name = "encrypted_full_name", columnDefinition = "TEXT")
    private String encryptedFullName;

    @Column(name = "encrypted_phone", columnDefinition = "TEXT")
    private String encryptedPhone;

    @Column(name = "encrypted_email", columnDefinition = "TEXT")
    private String encryptedEmail;

    @Column(name = "encrypted_address", columnDefinition = "TEXT")
    private String encryptedAddress;

    @Column(nullable = false)
    private String iv;

    @Column(name = "encryption_key_version", nullable = false, length = 50)
    private String encryptionKeyVersion;

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
