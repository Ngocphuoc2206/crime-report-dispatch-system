package com.ngocphuoc.crime.report.dispatch.controller;

import com.ngocphuoc.crime.report.dispatch.dto.request.RecallDispatchTaskRequest;
import com.ngocphuoc.crime.report.dispatch.dto.request.ReassignDispatchTaskRequest;
import com.ngocphuoc.crime.report.dispatch.dto.request.UpdateDispatchTaskStatusRequest;
import com.ngocphuoc.crime.report.dispatch.dto.response.AssignedDispatchTaskResponse;
import com.ngocphuoc.crime.report.dispatch.dto.response.DispatchTaskHistoryResponse;
import com.ngocphuoc.crime.report.dispatch.service.DispatchTaskHistoryService;
import com.ngocphuoc.crime.report.dispatch.service.DispatchTaskService;
import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/dispatch/tasks")
@Tag(name = "Dispatch Tasks", description = "Dispatch task lifecycle APIs")
public class DispatchTaskController {
    private final DispatchTaskService dispatchTaskService;
    private final DispatchTaskHistoryService dispatchTaskHistoryService;

    @GetMapping("/history")
    @Operation(summary = "List dispatch task history", description = "Return latest dispatch task history records.")
    public ApiResponse<List<DispatchTaskHistoryResponse>> getHistory(
            @RequestParam(defaultValue = "100") int limit
    ) {
        return ApiResponse.<List<DispatchTaskHistoryResponse>>builder()
                .data(dispatchTaskHistoryService.getHistory(limit))
                .build();
    }

    @GetMapping
    @Operation(summary = "List dispatch tasks", description = "Return assigned dispatch tasks.")
    public ApiResponse<List<AssignedDispatchTaskResponse>> getTasks() {
        return ApiResponse.<List<AssignedDispatchTaskResponse>>builder()
                .data(dispatchTaskService.getTasks())
                .build();
    }

    @GetMapping("/{taskId}")
    @Operation(summary = "Get dispatch task", description = "Return dispatch task detail by id.")
    public ApiResponse<AssignedDispatchTaskResponse> getTask(
            @Parameter(description = "Dispatch task id", example = "1") @PathVariable Long taskId
    ) {
        return ApiResponse.<AssignedDispatchTaskResponse>builder()
                .data(dispatchTaskService.getTask(taskId))
                .build();
    }

    @PatchMapping("/{taskId}/reassign")
    @Operation(summary = "Reassign dispatch task", description = "Assign a dispatch task to another officer or unit.")
    public ApiResponse<AssignedDispatchTaskResponse> reassign(
            @Parameter(description = "Dispatch task id", example = "1") @PathVariable Long taskId,
            @RequestBody ReassignDispatchTaskRequest request
    ) {
        return ApiResponse.<AssignedDispatchTaskResponse>builder()
                .data(dispatchTaskService.reassign(taskId, request))
                .build();
    }

    @PatchMapping("/{taskId}/recall")
    @Operation(summary = "Recall dispatch task", description = "Recall an assigned dispatch task.")
    public ApiResponse<AssignedDispatchTaskResponse> recall(
            @Parameter(description = "Dispatch task id", example = "1") @PathVariable Long taskId,
            @RequestBody(required = false) RecallDispatchTaskRequest request
    ) {
        return ApiResponse.<AssignedDispatchTaskResponse>builder()
                .data(dispatchTaskService.recall(taskId))
                .build();
    }

    @PatchMapping("/{taskId}/status")
    @Operation(summary = "Update dispatch task status", description = "Update the lifecycle status of a dispatch task.")
    public ApiResponse<AssignedDispatchTaskResponse> updateStatus(
            @Parameter(description = "Dispatch task id", example = "1") @PathVariable Long taskId,
            @RequestBody UpdateDispatchTaskStatusRequest request
    ) {
        return ApiResponse.<AssignedDispatchTaskResponse>builder()
                .data(dispatchTaskService.updateStatus(taskId, request))
                .build();
    }

    @PatchMapping("/by-case/{caseId}/complete")
    @Operation(summary = "Complete task by case id", description = "Complete the dispatch task linked to a case.")
    public ApiResponse<AssignedDispatchTaskResponse> completeByCaseId(
            @Parameter(description = "Case id", example = "1") @PathVariable Long caseId,
            @RequestBody(required = false) UpdateDispatchTaskStatusRequest request
    ) {
        String note = request == null ? null : request.note();

        return ApiResponse.<AssignedDispatchTaskResponse>builder()
                .data(dispatchTaskService.completeByCaseId(caseId, note, "REPORT_SERVICE"))
                .build();
    }
}
