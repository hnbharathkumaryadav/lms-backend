package com.lms.backend.controller;

import com.lms.backend.model.Certificate;
import com.lms.backend.model.User;
import com.lms.backend.repository.UserRepository;
import com.lms.backend.repository.CertificateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CertificateController {

    private final CertificateRepository certificateRepository;
    private final UserRepository userRepository;

    @GetMapping("/my")
    public ResponseEntity<List<com.lms.backend.dto.CertificateDto>> getMyCertificates(
            @AuthenticationPrincipal UserDetails userDetails) {
        User student = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Certificate> certificates = certificateRepository.findByStudent(student);

        List<com.lms.backend.dto.CertificateDto> dtos = certificates.stream()
                .map(cert -> com.lms.backend.dto.CertificateDto.builder()
                        .id(cert.getId())
                        .certificateCode(cert.getCertificateCode())
                        .studentName(cert.getStudentName())
                        .courseName(cert.getCourseName())
                        .issueDate(cert.getIssueDate())
                        .coverImageUrl(cert.getCourse().getCoverImageUrl())
                        .build())
                .toList();

        return ResponseEntity.ok(dtos);
    }
}
