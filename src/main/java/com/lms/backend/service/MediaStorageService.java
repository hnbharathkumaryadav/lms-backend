package com.lms.backend.service;

import org.springframework.web.multipart.MultipartFile;

public interface MediaStorageService {
    String uploadFile(MultipartFile file, Long relatedId);

    void deleteFile(String fileUrl);
}