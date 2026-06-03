package com.ngocphuoc.crime_report.common;

public record EncryptionResult(
        String cipherText,
        String iv,
        String keyVersion
) {
}
