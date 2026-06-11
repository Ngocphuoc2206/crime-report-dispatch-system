package com.ngocphuoc.crime_report.evidence.service;

import com.ngocphuoc.crime_report.common.ErrorCode;
import com.ngocphuoc.crime_report.evidence.client.ReportClient;
import com.ngocphuoc.crime_report.evidence.dto.ReportLookupResponse;
import com.ngocphuoc.crime_report.exception.AppException;
import com.ngocphuoc.crime_report.evidence.entity.EvidenceFile;
import com.ngocphuoc.crime_report.evidence.enums.EvidenceFileType;
import com.ngocphuoc.crime_report.evidence.repository.EvidenceFileRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.util.HexFormat;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class EvidenceFileService {

    private final EvidenceFileRepository evidenceFileRepository;
    private final Path evidenceStorageDir;
    private final ReportClient reportClient;

    private static final Map<String, EvidenceFileType> MIME_PREFIX = Map.of(
            "image/", EvidenceFileType.IMAGE,
            "video/", EvidenceFileType.VIDEO,
            "audio/", EvidenceFileType.AUDIO,
            "application/pdf", EvidenceFileType.DOCUMENT
    );

    public EvidenceFileService(
            EvidenceFileRepository evidenceFileRepository,
            @Value("${app.storage.evidence-dir}") String evidenceStorageDirStr,
            ReportClient reportClient
    ) {
        this.evidenceFileRepository = evidenceFileRepository;
        this.evidenceStorageDir = Paths.get(evidenceStorageDirStr).toAbsolutePath().normalize();
        this.reportClient = reportClient;
    }

    public void saveEvidenceFiles(String trackingCode, List<MultipartFile> files) {
        if (files == null || files.isEmpty()) {
            return;
        }

        ReportLookupResponse report = reportClient.findByTrackingCode(trackingCode);

        try {
            if (Files.notExists(evidenceStorageDir)) {
                Files.createDirectories(evidenceStorageDir);
            }
        } catch (Exception e) {
            throw new IllegalStateException("Failed to create evidence storage directory", e);
        }

        for (MultipartFile file : files) {
            if (file == null || file.isEmpty()) {
                continue;
            }
            saveSingleFile(report.caseId(), report.trackingCode(), file);
        }
    }

    public EvidenceFile getEvidenceByID(Long evidenceId){
        return evidenceFileRepository.findById(evidenceId)
                .orElseThrow(() -> new AppException(ErrorCode.EVIDENCE_NOT_FOUND));
    }

    public ResponseEntity<Resource> downloadEvidence(Long evidenceId) {
        EvidenceFile evidence = getEvidenceByID(evidenceId);

        Path path = Paths.get(evidence.getFileUrl()).toAbsolutePath().normalize();

        Resource resource;
        try {
            resource = new UrlResource(path.toUri());
        } catch (MalformedURLException e) {
            throw new IllegalStateException("Invalid evidence file path", e);
        }

        if (!resource.exists() || !resource.isReadable()) {
            throw new AppException(ErrorCode.EVIDENCE_NOT_FOUND);
        }

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + evidence.getOriginalFileName() + "\""
                )
                .header(HttpHeaders.CONTENT_TYPE, evidence.getMimeType())
                .body(resource);
    }

    private void saveSingleFile(Long caseId, String trackingCode, MultipartFile file) {
        try {
            String originalFileName = sanitizeFileName(file.getOriginalFilename());
            String extension = extractExtension(originalFileName);
            String storedFileName = UUID.randomUUID() + extension;
            Path targetPath = evidenceStorageDir.resolve(storedFileName).normalize();

            // Lưu file vật lý vào ổ đĩa
            file.transferTo(targetPath);

            EvidenceFile evidenceFile = new EvidenceFile();
            evidenceFile.setCaseId(caseId);
            evidenceFile.setTrackingCode(trackingCode);
            evidenceFile.setFileName(storedFileName);
            evidenceFile.setOriginalFileName(originalFileName);
            evidenceFile.setFileType(resolveFileType(file.getContentType()));
            evidenceFile.setMimeType(file.getContentType());
            evidenceFile.setFileUrl(targetPath.toString());
            evidenceFile.setFileSize(file.getSize());
            evidenceFile.setChecksum(calculateSha256(targetPath));

            evidenceFileRepository.save(evidenceFile);

        } catch (Exception exception) {
            throw new IllegalStateException("Failed to save evidence file", exception);
        }
    }

    private String sanitizeFileName(String originalFileName) {
        if (originalFileName == null || originalFileName.isBlank()) {
            return "unknown";
        }

        return Path.of(originalFileName)
                .getFileName().toString()
                .replaceAll("[^a-zA-Z0-9._-]", "_");
    }

    private String extractExtension(String fileName) {
        int lastDotIndex = fileName.lastIndexOf(".");
        if (lastDotIndex < 0) {
            return "";
        }

        return fileName.substring(lastDotIndex);
    }

    private EvidenceFileType resolveFileType(String mimeType) {
        if (mimeType == null) {
            return EvidenceFileType.OTHER;
        }

        for (Map.Entry<String, EvidenceFileType> entry : MIME_PREFIX.entrySet()) {
            if (mimeType.startsWith(entry.getKey())) {
                return entry.getValue();
            }
        }
        return EvidenceFileType.OTHER;
    }

    private String calculateSha256(Path path) {
        try (InputStream inputStream = Files.newInputStream(path)) {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] buffer = new byte[8192];
            int bytesRead;

            while ((bytesRead = inputStream.read(buffer)) != -1) {
                digest.update(buffer, 0, bytesRead);
            }

            return HexFormat.of().formatHex(digest.digest());
        } catch (Exception exception) {
            throw new IllegalStateException("Failed to calculate file checksum", exception);
        }
    }
}
