package com.ngocphuoc.crime_report.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI evidenceServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Crime Report Dispatch System - Evidence Service API")
                        .version("1.0.0")
                        .description("API quản lý chứng cứ, file đính kèm, metadata chứng cứ.")
                        .contact(new Contact()
                                .name("Crime Report Dispatch System")))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"));
    }
}
