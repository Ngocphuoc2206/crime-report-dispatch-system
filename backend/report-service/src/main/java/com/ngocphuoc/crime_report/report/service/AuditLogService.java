package com.ngocphuoc.crime_report.report.service;

import com.ngocphuoc.crime_report.report.dto.response.AuditLogCommand;
import com.ngocphuoc.crime_report.report.entity.AuditLog;
import com.ngocphuoc.crime_report.report.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuditLogService {
    private final AuditLogRepository auditLogRepository;

    public void writeLog(
            AuditLogCommand command
    ){
        AuditLog auditLog = new AuditLog();

        auditLog.setActorUserId(command.actorUserId());
        auditLog.setActorRole(command.actorRole());

        auditLog.setAction(command.action().name());
        auditLog.setResourceType(command.resourceType().name());
        auditLog.setResourceId(command.resourceId());

        auditLog.setOldValue(command.oldValue());
        auditLog.setNewValue(command.newValue());
        auditLog.setNote(command.note());

        auditLog.setIpAddress(command.ipAddress());
        auditLog.setUserAgent(command.userAgent());
        auditLog.setDetail(command.detail());

        auditLogRepository.save(auditLog);
    }
}
