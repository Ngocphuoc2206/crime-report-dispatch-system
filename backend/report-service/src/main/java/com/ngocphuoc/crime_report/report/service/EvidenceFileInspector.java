package com.ngocphuoc.crime_report.report.service;

import java.util.List;

import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class EvidenceFileInspector {
     public boolean hasVideoEvidence(List<MultipartFile> files) {
        if (files == null || files.isEmpty()) {
            return false;
        }

        return files.stream()
                .filter(file -> file != null && !file.isEmpty())
                .anyMatch(file -> {
                    String contentType = file.getContentType();
                    return contentType != null && contentType.startsWith("video/");
                });
    }
}
