package com.ngocphuoc.crime_report.identity.dto;

public record EncryptionResult(
        String cipherText,
        String iv,
        String keyVersion
) {
}
