package com.lms.backend.dto;

import lombok.Data;

@Data
public class ForumPostRequest {
    private String content;
    private Long userId;
    private Long parentPostId;
}
