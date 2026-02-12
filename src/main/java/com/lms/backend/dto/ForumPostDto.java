package com.lms.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
public class ForumPostDto {
    private Long id;
    private String content;
    private Long authorId;
    private String authorName;
    private String authorRole;
    private LocalDateTime createdAt;
    private boolean locked;
    private List<ForumPostDto> replies = new ArrayList<>();

    // Manual constructor for safety
    public ForumPostDto(Long id, String content, Long authorId, String authorName, String authorRole,
            LocalDateTime createdAt, boolean locked) {
        this.id = id;
        this.content = content;
        this.authorId = authorId;
        this.authorName = authorName;
        this.authorRole = authorRole;
        this.createdAt = createdAt;
        this.locked = locked;
        this.replies = new ArrayList<>();
    }
}
