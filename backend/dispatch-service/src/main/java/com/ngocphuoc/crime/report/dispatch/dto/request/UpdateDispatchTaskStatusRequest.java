package com.ngocphuoc.crime.report.dispatch.dto.request;

import com.ngocphuoc.crime.report.dispatch.enums.DispatchStatus;

public record UpdateDispatchTaskStatusRequest(
        DispatchStatus status,
        String note
) {}
