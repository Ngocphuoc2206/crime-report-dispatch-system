package com.ngocphuoc.crime_report.evidence.service;

import com.ngocphuoc.crime_report.evidence.client.ReportClient;
import com.ngocphuoc.crime_report.evidence.repository.EvidenceFileRepository;
import com.ngocphuoc.crime_report.shared.exception.AppException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verifyNoInteractions;

@ExtendWith(MockitoExtension.class)
class EvidenceFileServiceTest {

    @Mock
    private EvidenceFileRepository evidenceFileRepository;

    @Mock
    private ReportClient reportClient;

    @Test
    void saveEvidenceFiles_shouldRejectPdfMimeType() {
        EvidenceFileService service = createService();
        MockMultipartFile pdf = new MockMultipartFile(
                "files",
                "evidence.pdf",
                "application/pdf",
                "%PDF-1.7".getBytes(StandardCharsets.US_ASCII)
        );

        assertThrows(
                AppException.class,
                () -> service.saveEvidenceFiles("TRACKING-001", List.of(pdf))
        );
        verifyNoInteractions(reportClient, evidenceFileRepository);
    }

    @Test
    void saveEvidenceFiles_shouldRejectPdfSignatureWithSpoofedImageMimeType() {
        EvidenceFileService service = createService();
        MockMultipartFile disguisedPdf = new MockMultipartFile(
                "files",
                "evidence.jpg",
                "image/jpeg",
                "%PDF-1.7".getBytes(StandardCharsets.US_ASCII)
        );

        assertThrows(
                AppException.class,
                () -> service.saveEvidenceFiles("TRACKING-001", List.of(disguisedPdf))
        );
        verifyNoInteractions(reportClient, evidenceFileRepository);
    }

    private EvidenceFileService createService() {
        return new EvidenceFileService(
                evidenceFileRepository,
                "target/test-evidences",
                reportClient
        );
    }
}
