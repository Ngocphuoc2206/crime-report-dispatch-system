package com.ngocphuoc.crime_report.report.service;

import com.ngocphuoc.crime_report.report.dto.response.PublicCaseNotificationResponse;
import com.ngocphuoc.crime_report.report.dto.response.PublicProcessingFeedResponse;
import com.ngocphuoc.crime_report.report.entity.CaseNotification;
import com.ngocphuoc.crime_report.report.repository.CaseNotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CaseNotificationService {
    private static final List<String> COMMUNITY_SAFETY_TIPS = List.of(
            "Nếu phát hiện dấu hiệu bất thường, hãy ưu tiên an toàn cá nhân và gửi tin báo kèm vị trí, thời gian, bằng chứng nếu có.",
            "Không tự ý tiếp cận hoặc truy đuổi đối tượng nghi vấn; hãy chờ lực lượng chức năng xử lý.",
            "Theo dõi tiến độ bằng mã hồ sơ riêng của bạn, không chia sẻ thông tin cá nhân hoặc bằng chứng nhạy cảm lên mạng xã hội."
    );

    private final CaseNotificationRepository caseNotificationRepository;

    @Transactional
    public void recordAssignmentChange(
            Long caseId,
            Long previousUnitId,
            Long previousOfficerId,
            Long assignedUnitId,
            Long assignedOfficerId
    ) {
        if (same(previousUnitId, assignedUnitId) && same(previousOfficerId, assignedOfficerId)) {
            return;
        }

        CaseNotification notification = new CaseNotification();
        notification.setCaseId(caseId);
        notification.setIsPublic(true);

        if (assignedUnitId == null && assignedOfficerId == null) {
            notification.setNotificationType("DISPATCH_RECALLED");
            notification.setTitle("Phương án xử lý đang được rà soát");
            notification.setPublicMessage(
                    "Một tin báo cộng đồng đang được rà soát lại phương án xử lý để bảo đảm phù hợp với tình hình thực tế."
            );
        } else if (previousUnitId == null && previousOfficerId == null) {
            notification.setNotificationType("CASE_DISPATCHED");
            notification.setTitle("Tin báo cộng đồng đã được chuyển xử lý");
            notification.setPublicMessage(
                    "Hệ thống đã ghi nhận một tin báo phù hợp và chuyển đến bộ phận phụ trách để tiếp tục xác minh, xử lý."
            );
        } else {
            notification.setNotificationType("CASE_REASSIGNED");
            notification.setTitle("Phương án xử lý được cập nhật");
            notification.setPublicMessage(
                    "Một tin báo cộng đồng đã được điều chỉnh hướng xử lý để chuyển đến bộ phận phụ trách phù hợp hơn."
            );
        }

        caseNotificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public List<PublicCaseNotificationResponse> getPublicNotifications(Long caseId) {
        return caseNotificationRepository
                .findByCaseIdAndIsPublicTrueOrderByCreatedAtAsc(caseId)
                .stream()
                .map(this::toPublicResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public PublicProcessingFeedResponse getPublicProcessingFeed() {
        long updatesLast24Hours =
                caseNotificationRepository.countByIsPublicTrueAndCreatedAtGreaterThanEqual(
                        LocalDateTime.now().minusHours(24)
                );
        List<PublicCaseNotificationResponse> latestUpdates =
                caseNotificationRepository.findTop6ByIsPublicTrueOrderByCreatedAtDesc()
                        .stream()
                        .map(this::toPublicResponse)
                        .toList();

        return new PublicProcessingFeedResponse(
                updatesLast24Hours,
                buildCommunityHeadline(updatesLast24Hours),
                buildCommunitySummary(updatesLast24Hours),
                COMMUNITY_SAFETY_TIPS,
                latestUpdates
        );
    }

    private PublicCaseNotificationResponse toPublicResponse(CaseNotification notification) {
        return new PublicCaseNotificationResponse(
                notification.getId(),
                notification.getNotificationType(),
                notification.getTitle(),
                notification.getPublicMessage(),
                notification.getCreatedAt()
        );
    }

    private String buildCommunityHeadline(long updatesLast24Hours) {
        if (updatesLast24Hours == 0) {
            return "Cộng đồng hiện chưa có cập nhật xử lý mới";
        }

        return "Có " + updatesLast24Hours + " cập nhật xử lý trong 24 giờ qua";
    }

    private String buildCommunitySummary(long updatesLast24Hours) {
        if (updatesLast24Hours == 0) {
            return "Hệ thống vẫn duy trì tiếp nhận tin báo 24/7. Người dân có thể gửi tin báo hoặc tra cứu tiến độ bằng mã hồ sơ cá nhân.";
        }

        return "Các tin báo được hiển thị dưới dạng đã ẩn danh để người dân nắm được nhịp xử lý chung, không công khai mã hồ sơ, vị trí chi tiết, danh tính người báo tin hoặc cán bộ phụ trách.";
    }

    private boolean same(Long left, Long right) {
        return left == null ? right == null : left.equals(right);
    }
}
