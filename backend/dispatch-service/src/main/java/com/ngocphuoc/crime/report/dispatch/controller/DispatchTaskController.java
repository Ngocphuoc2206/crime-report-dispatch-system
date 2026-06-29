package com.ngocphuoc.crime.report.dispatch.controller;

import com.ngocphuoc.crime.report.dispatch.dto.request.RecallDispatchTaskRequest;
import com.ngocphuoc.crime.report.dispatch.dto.request.ReassignDispatchTaskRequest;
import com.ngocphuoc.crime.report.dispatch.dto.request.UpdateDispatchTaskStatusRequest;
import com.ngocphuoc.crime.report.dispatch.dto.response.AssignedDispatchTaskResponse;
import com.ngocphuoc.crime.report.dispatch.dto.response.DispatchTaskHistoryResponse;
import com.ngocphuoc.crime.report.dispatch.service.DispatchTaskHistoryService;
import com.ngocphuoc.crime.report.dispatch.service.DispatchTaskService;
import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/dispatch/tasks")
public class DispatchTaskController {
    private final DispatchTaskService dispatchTaskService;
    private final DispatchTaskHistoryService dispatchTaskHistoryService;

    @GetMapping("/history")
    public ApiResponse<List<DispatchTaskHistoryResponse>> getHistory(
            @RequestParam(defaultValue = "100") int limit
    ) {
        return ApiResponse.<List<DispatchTaskHistoryResponse>>builder()
                .data(dispatchTaskHistoryService.getHistory(limit))
                .build();
    }

    @GetMapping
    public ApiResponse<List<AssignedDispatchTaskResponse>> getTasks() {
        return ApiResponse.<List<AssignedDispatchTaskResponse>>builder()
                .data(dispatchTaskService.getTasks())
                .build();
    }

    @GetMapping("/{taskId}")
    public ApiResponse<AssignedDispatchTaskResponse> getTask(@PathVariable Long taskId) {
        return ApiResponse.<AssignedDispatchTaskResponse>builder()
                .data(dispatchTaskService.getTask(taskId))
                .build();
    }

    @PatchMapping("/{taskId}/reassign")
    public ApiResponse<AssignedDispatchTaskResponse> reassign(
            @PathVariable Long taskId,
            @RequestBody ReassignDispatchTaskRequest request
    ) {
        return ApiResponse.<AssignedDispatchTaskResponse>builder()
                .data(dispatchTaskService.reassign(taskId, request))
                .build();
    }

    @PatchMapping("/{taskId}/recall")
    public ApiResponse<AssignedDispatchTaskResponse> recall(
            @PathVariable Long taskId,
            @RequestBody(required = false) RecallDispatchTaskRequest request
    ) {
        return ApiResponse.<AssignedDispatchTaskResponse>builder()
                .data(dispatchTaskService.recall(taskId))
                .build();
    }

    @PatchMapping("/{taskId}/status")
    public ApiResponse<AssignedDispatchTaskResponse> updateStatus(
            @PathVariable Long taskId,
            @RequestBody UpdateDispatchTaskStatusRequest request
    ) {
        return ApiResponse.<AssignedDispatchTaskResponse>builder()
                .data(dispatchTaskService.updateStatus(taskId, request))
                .build();
    }
}
