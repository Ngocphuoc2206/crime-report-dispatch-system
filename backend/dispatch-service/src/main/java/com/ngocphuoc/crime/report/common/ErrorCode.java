package com.ngocphuoc.crime.report.common;

import lombok.Getter;

@Getter
public enum ErrorCode implements com.ngocphuoc.crime_report.shared.error.ErrorCode {
    // EVIDENCE
    EVIDENCE_NOT_FOUND("DISPATCH_1001", "Evidence not found"),

    // DISPATCH
    LATITUDE_NOT_SUITABLE("DISPATCH_1002", "Latitude is between -90 and 90"),
    LONGITUDE_NOT_SUITABLE("DISPATCH_1003", "Longitude is between -180 and 180"),
    NO_POLICE_UNIT_FOUND_NEARBY("DISPATCH_1004", "No active police unit with location found"),

    // Case
    CASE_ID_REQUIRED("DISPATCH_1005", "CaseId is required"),
    CASE_ALREADY_DISPATCHED("DISPATCH_1006","Case have already dispatched" ),
    NO_AVAILABLE_OFFICER("DISPATCH_1007", "Officer is not available"),
    OFFICER_NOT_FOUND("DISPATCH_1008", "Officer not found"),
    OFFICER_USER_ALREADY_EXISTS(
            "DISPATCH_1009",
            "Officer profile already exists for this user"
    ),
    BADGE_NUMBER_ALREADY_EXISTS(
            "DISPATCH_1010",
            "Badge number already exists"
    ),
    POLICE_UNIT_NOT_FOUND(
            "DISPATCH_1011",
            "Police unit not found"
    ),
    POLICE_UNIT_INACTIVE(
            "DISPATCH_1012",
            "Police unit is inactive"
    ),
    DISPATCH_TASK_NOT_FOUND(
            "DISPATCH_1013",
            "Dispatch task not found"
    ),
    REPORT_NOT_DISPATCHABLE(
            "DISPATCH_1014",
            "Report is missing dispatchable location or status"
    ),
    ADMINISTRATIVE_AREA_NOT_FOUND(
            "DISPATCH_1015",
            "Administrative area not found"
    ),
    POLICE_UNIT_CODE_ALREADY_EXISTS(
            "DISPATCH_1016",
            "Police unit code already exists"
    ),
    // Uncategorized
    UNCATEGORIZED_EXCEPTION("EVIDENCE_9998", "UNCATEGORIZED_EXCEPTION!");
    ErrorCode(String code, String message){
        this.code = code;
        this.message = message;
    }

    private final String code;
    private final String message;
}
