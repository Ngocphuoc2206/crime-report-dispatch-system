package com.ngocphuoc.crime_report.evidence.service;

import com.ngocphuoc.crime_report.report.entity.CaseReport;
import com.ngocphuoc.crime_report.evidence.entity.EvidenceFile;
import com.ngocphuoc.crime_report.evidence.enums.EvidenceFileType;
import com.ngocphuoc.crime_report.evidence.repository.EvidenceFileRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
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

    private static final Map<String, EvidenceFileType> MIME_PREFIX = Map.of(
            "image/", EvidenceFileType.IMAGE,
            "video/", EvidenceFileType.VIDEO,
            "audio/", EvidenceFileType.AUDIO,
            "application/pdf", EvidenceFileType.DOCUMENT
    );

    public EvidenceFileService(
            EvidenceFileRepository evidenceFileRepository,
            @Value("${app.storage.evidence-dir}") String evidenceStorageDirStr
    ) {
        this.evidenceFileRepository = evidenceFileRepository;
        this.evidenceStorageDir = Paths.get(evidenceStorageDirStr).toAbsolutePath().normalize();
    }

    public void saveEvidenceFiles(CaseReport caseReport, List<MultipartFile> files) {
        if (files == null || files.isEmpty()) {
            return;
        }

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
            saveSingleFile(caseReport, file);
        }
    }

    private void saveSingleFile(CaseReport caseReport, MultipartFile file) {
        try {
            String originalFileName = sanitizeFileName(file.getOriginalFilename());
            String extension = extractExtension(originalFileName);
            String storedFileName = UUID.randomUUID() + extension;
            Path targetPath = evidenceStorageDir.resolve(storedFileName).normalize();

            // Lưu file vật lý vào ổ đĩa
            file.transferTo(targetPath);

            EvidenceFile evidenceFile = new EvidenceFile();
            evidenceFile.setCaseReport(caseReport);
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