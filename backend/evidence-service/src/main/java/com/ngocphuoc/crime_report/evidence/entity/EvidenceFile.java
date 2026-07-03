package com.ngocphuoc.crime_report.evidence.entity;

import com.ngocphuoc.crime_report.evidence.enums.EvidenceFileType;
import com.ngocphuoc.crime_report.evidence.enums.EvidenceVerificationStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "evidence_file")
public class EvidenceFile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "case_id")
    private Long caseId;

    @Column(name = "tracking_code", nullable = false, length = 50)
    private String trackingCode;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "original_file_name")
    private String originalFileName;

    @Enumerated(EnumType.STRING)
    @Column(name = "file_type", nullable = false, length = 50)
    private EvidenceFileType fileType;

    @Column(name = "mime_type", length = 100)
    private String mimeType;

    @Column(name = "file_url", nullable = false, columnDefinition = "TEXT")
    private String fileUrl;

    @Column(name = "file_size", nullable = false)
    private Long fileSize;

    @Column(nullable = false, length = 128)
    private String checksum;

    @Column(name = "uploaded_at", nullable = false, insertable = false, updatable = false)
    private LocalDateTime uploadedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status", nullable = false, length = 30)
    private EvidenceVerificationStatus verificationStatus = EvidenceVerificationStatus.PENDING;

    @Column(name = "verification_note", columnDefinition = "TEXT")
    private String verificationNote;

    @Column(name = "verified_by_user_id")
    private Long verifiedByUserId;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;
}
