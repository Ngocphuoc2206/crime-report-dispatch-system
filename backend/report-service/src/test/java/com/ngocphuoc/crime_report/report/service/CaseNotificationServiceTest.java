package com.ngocphuoc.crime_report.report.service;

import com.ngocphuoc.crime_report.report.dto.response.PublicProcessingFeedResponse;
import com.ngocphuoc.crime_report.report.entity.CaseNotification;
import com.ngocphuoc.crime_report.report.repository.CaseNotificationRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CaseNotificationServiceTest {

    @Mock
    private CaseNotificationRepository caseNotificationRepository;

    @InjectMocks
    private CaseNotificationService caseNotificationService;

    @Test
    void recordAssignmentChange_shouldCreatePublicDispatchNotification() {
        caseNotificationService.recordAssignmentChange(10L, null, null, 2L, 7L);

        ArgumentCaptor<CaseNotification> captor =
                ArgumentCaptor.forClass(CaseNotification.class);
        verify(caseNotificationRepository).save(captor.capture());

        CaseNotification notification = captor.getValue();
        assertEquals(10L, notification.getCaseId());
        assertEquals("CASE_DISPATCHED", notification.getNotificationType());
        assertEquals("Tin báo cộng đồng đã được chuyển xử lý", notification.getTitle());
        assertEquals(true, notification.getIsPublic());
    }

    @Test
    void recordAssignmentChange_shouldNotDuplicateUnchangedAssignment() {
        caseNotificationService.recordAssignmentChange(10L, 2L, 7L, 2L, 7L);

        verify(caseNotificationRepository, never()).save(
                org.mockito.ArgumentMatchers.any()
        );
    }

    @Test
    void getPublicProcessingFeed_shouldReturnCommunityContentWithoutIdentifiers() {
        CaseNotification notification = new CaseNotification();
        notification.setId(3L);
        notification.setCaseId(99L);
        notification.setNotificationType("CASE_DISPATCHED");
        notification.setTitle("Tin báo cộng đồng đã được chuyển xử lý");
        notification.setPublicMessage("Một tin báo phù hợp đã được chuyển đến bộ phận phụ trách.");
        notification.setCreatedAt(LocalDateTime.of(2026, 7, 9, 10, 0));

        when(caseNotificationRepository.countByIsPublicTrueAndCreatedAtGreaterThanEqual(
                any(LocalDateTime.class)
        )).thenReturn(4L);
        when(caseNotificationRepository.findTop6ByIsPublicTrueOrderByCreatedAtDesc())
                .thenReturn(List.of(notification));

        PublicProcessingFeedResponse result =
                caseNotificationService.getPublicProcessingFeed();

        assertEquals(4L, result.updatesLast24Hours());
        assertEquals("Có 4 cập nhật xử lý trong 24 giờ qua", result.headline());
        assertEquals(3, result.safetyTips().size());
        assertEquals(1, result.latestUpdates().size());
        assertEquals("CASE_DISPATCHED", result.latestUpdates().getFirst().type());
    }
}
