package com.ngocphuoc.crime_report.service;


import com.ngocphuoc.crime_report.identity.dto.EncryptionResult;
import com.ngocphuoc.crime_report.identity.service.EncryptionService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.security.SecureRandom;
import java.util.Base64;

public class EncryptionServiceTest {
    @Test
    void encryptAndDecrypt_shouldReturnOriginalPlainText(){
        // Init object
        String secret = generateBase64();
        EncryptionService encryptionService = new EncryptionService();

        ReflectionTestUtils.setField(encryptionService, "secretBase64", secret);
        ReflectionTestUtils.setField(encryptionService, "keyVersion", "v1");

        encryptionService.init();

        // Test
        String plainText = "Nguyễn Văn A - 0900000000";
        EncryptionResult encryptionResult = encryptionService.encrypt(plainText);
        String decrypted = encryptionService.decrypt(
                encryptionResult.cipherText(),
                encryptionResult.iv()
        );

        Assertions.assertNotNull(encryptionResult);
        Assertions.assertNotEquals(plainText, encryptionResult.cipherText());

        Assertions.assertEquals(plainText, decrypted);
        Assertions.assertEquals("v1", encryptionResult.keyVersion());
    }

    @Test
    void encryptSamePlainTextTwice_shouldGenerateDifferenceCipherTextAndIv(){
        String secret = generateBase64();
        EncryptionService encryptionService = new EncryptionService();

        ReflectionTestUtils.setField(encryptionService, "secretBase64", secret);
        ReflectionTestUtils.setField(encryptionService, "keyVersion", "v1");

        encryptionService.init();

        String plainText = "0900000000";
        EncryptionResult first = encryptionService.encrypt(plainText);
        EncryptionResult second = encryptionService.encrypt(plainText);

        Assertions.assertNotEquals(first.iv(), second.iv());
        Assertions.assertNotEquals(first.cipherText(), second.cipherText());
    }

    private String generateBase64(){
        byte[] key = new byte[32];
        new SecureRandom().nextBytes(key);
        return Base64.getEncoder().encodeToString(key);
    }
}
