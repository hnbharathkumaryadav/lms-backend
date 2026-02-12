package com.lms.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class CertificateDto {
    private Long id;
    private String certificateCode;
    private String studentName;
    private String courseName;
    private LocalDateTime issueDate;
    private String coverImageUrl;
}
