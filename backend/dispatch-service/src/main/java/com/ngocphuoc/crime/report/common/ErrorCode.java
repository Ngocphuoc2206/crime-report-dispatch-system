package com.ngocphuoc.crime.report.common;

import lombok.Getter;

@Getter
public enum ErrorCode implements com.ngocphuoc.crime_report.shared.error.ErrorCode {
    // EVIDENCE
    EVIDENCE_NOT_FOUND("EVIDENCE_1006", "Evidence not found"),

    // DISPATCH
    LATITUDE_NOT_SUITABLE("DISPATCH_1001", "Latitude is between -90 and 90"),
    LONGITUDE_NOT_SUITABLE("DISPATCH_1002", "Longitude is between -180 and 180"),
    NO_POLICE_UNIT_FOUND_NEARBY("DISPATCH_1003", "No active police unit with location found"),

    // Case
    CASE_ID_REQUIRED("CASE_1001", "CaseId is required"),
    CASE_ALREADY_DISPATCHED("CASE_1002","Case have already dispatched" ),
    NO_AVAILABLE_OFFICER("CASE_1003", "Officer is not available"),
    // Uncategorized
    UNCATEGORIZED_EXCEPTION("EVIDENCE_9998", "UNCATEGORIZED_EXCEPTION!");
    ErrorCode(String code, String message){
        this.code = code;
        this.message = message;
    }

    private final String code;
    private final String message;
}
