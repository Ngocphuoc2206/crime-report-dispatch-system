package com.ngocphuoc.crime_report.identity.service;

import com.ngocphuoc.crime_report.identity.dto.EncryptionResult;
import com.ngocphuoc.crime_report.common.ErrorCode;
import com.ngocphuoc.crime_report.shared.exception.AppException;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class EncryptionService {
    private static final String AES_ALGORITHM = "AES";
    private static final String AES_GCM_TRANSFORMATION = "AES/GCM/NoPadding";

    private static final int GCM_TAG_LENGTH_BITS = 128;
    private static final int GCM_IV_LENGTH_BYTES = 12;

    @Value("${app.encryption.secret-base64}")
    private String secretBase64;

    @Value("${app.encryption.key-version}")
    private String keyVersion;

    private SecretKey secretKey;
    private final SecureRandom secureRandom = new SecureRandom();

    @PostConstruct
    public void init(){
        this.secretKey = buildSecretKey(this.secretBase64);
    }

    public String getCurrentVersion(){
        return keyVersion;
    }

    public EncryptionResult encrypt(String plainText){
        if (plainText == null){
            return null;
        }

        try{
            // Config AES-GCM
            byte[] iv = generateIv();
            Cipher cipher = Cipher.getInstance(AES_GCM_TRANSFORMATION);
            GCMParameterSpec gcmParameterSpec = new GCMParameterSpec(GCM_TAG_LENGTH_BITS, iv);

            cipher.init(Cipher.ENCRYPT_MODE, secretKey, gcmParameterSpec);

            byte[] cipherBytes = cipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));

            return new EncryptionResult(
                    Base64.getEncoder().encodeToString(cipherBytes),
                    Base64.getEncoder().encodeToString(iv),
                    keyVersion
            );
        }  catch (Exception exception) {
            throw new IllegalStateException("Failed to encrypt data", exception);
        }
    }

    public String decrypt(String cipherTextBase64, String ivBase64){
        if (cipherTextBase64 == null || ivBase64 == null) {
            return null;
        }

        try {
            byte[] cipherBytes = Base64.getDecoder().decode(cipherTextBase64);
            byte[] iv = Base64.getDecoder().decode(ivBase64);

            Cipher cipher = Cipher.getInstance(AES_GCM_TRANSFORMATION);
            GCMParameterSpec gcmParameterSpec =
                    new GCMParameterSpec(GCM_TAG_LENGTH_BITS, iv);

            cipher.init(Cipher.DECRYPT_MODE, secretKey, gcmParameterSpec);

            byte[] plainBytes = cipher.doFinal(cipherBytes);

            return new String(plainBytes, StandardCharsets.UTF_8);
        } catch (Exception exception) {
            throw new IllegalStateException("Failed to decrypt data", exception);
        }
    }

    private byte[] generateIv(){
        byte[] iv = new byte[GCM_IV_LENGTH_BYTES];
        secureRandom.nextBytes(iv);
        return iv;
    }

    private SecretKey buildSecretKey(String secretBase64){
        byte[] keyBytes = Base64.getDecoder().decode(secretBase64);

        if (keyBytes.length != 16 && keyBytes.length != 24 && keyBytes.length != 32){
            throw new AppException(ErrorCode.AES_NOT_FOUND);
        }
        return new SecretKeySpec(keyBytes, AES_ALGORITHM);
    }
}
