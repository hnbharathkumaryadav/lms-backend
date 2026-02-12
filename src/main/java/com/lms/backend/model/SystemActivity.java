package com.lms.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "system_activities")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String type; // e.g., "COURSE", "USER", "SYSTEM"

    @Column(nullable = false)
    private String message;

    private String icon; // e.g., "✅", "👤"

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
