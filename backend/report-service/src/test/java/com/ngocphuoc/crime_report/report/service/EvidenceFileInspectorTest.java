package com.ngocphuoc.crime_report.report.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

public class EvidenceFileInspectorTest {
    private final EvidenceFileInspector inspectorTest = new EvidenceFileInspector();

    @Test
    void hasVideoEvidence_shouldReturnFalse_whenFilesIsNull(){
        assertFalse(inspectorTest.hasVideoEvidence(null));
    }

    @Test
    void hasVideoEvidence_shouldReturnFalse_whenFilesIsEmpty(){
        assertFalse(inspectorTest.hasVideoEvidence(List.of()));
    }

    @Test
    void hasVideoEvidence_shouldReturnTrue_whenContainsVideoFile(){
        MockMultipartFile image = new MockMultipartFile(
            "files",
            "image.png",
            "image/png",
            "image-content".getBytes()
        );

        MockMultipartFile video = new MockMultipartFile(
            "files",
            "video.mp4",
            "video/mp4",
            "video-content".getBytes()
        );

        assertTrue(inspectorTest.hasVideoEvidence(List.of(image, video)));
    }

    @Test
    void hasVideoEvidence_shouldReturnFalse_whenOnlyImageFiles() {
        MockMultipartFile image = new MockMultipartFile(
                "files",
                "image.png",
                "image/png",
                "image-content".getBytes()
        );

        assertFalse(inspectorTest.hasVideoEvidence(List.of(image)));
    }
}
