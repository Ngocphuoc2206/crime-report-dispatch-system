package com.ngocphuoc.crime_report.urgency.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "urgency_rule")
public class UrgencyRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ruleCode;

    private Integer scoreValue;

    private String description;

    private Boolean isActive;
}
