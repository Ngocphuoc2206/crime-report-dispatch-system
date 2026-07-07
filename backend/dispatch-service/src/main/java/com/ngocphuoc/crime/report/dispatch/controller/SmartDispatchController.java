package com.ngocphuoc.crime.report.dispatch.controller;

import com.ngocphuoc.crime.report.dispatch.dto.request.SmartDispatchRequest;
import com.ngocphuoc.crime.report.dispatch.dto.response.SmartDispatchResponse;
import com.ngocphuoc.crime.report.dispatch.service.SmartDispatchService;
import com.ngocphuoc.crime_report.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/dispatch")
@Tag(name = "Smart Dispatch", description = "Automatic dispatch recommendation APIs")
public class SmartDispatchController {

    private final SmartDispatchService smartDispatchService;

    @PostMapping("/smart-dispatch")
    @Operation(summary = "Run smart dispatch", description = "Recommend and assign a suitable officer or unit for a case.")
    public ApiResponse<SmartDispatchResponse> smartDispatch(
            @RequestBody SmartDispatchRequest request
    ) {
        return ApiResponse.<SmartDispatchResponse>builder()
                .data(smartDispatchService.dispatch(request))
                .build();
    }
}
