package com.lms.backend.service;

import com.lms.backend.dto.ForumPostDto;
import com.lms.backend.dto.ForumPostRequest;
import java.util.List;

public interface ForumPostService {
    ForumPostDto createPost(ForumPostRequest request);

    List<ForumPostDto> getAllTopLevelPosts();

    void deletePost(Long postId);

    ForumPostDto lockPost(Long postId, boolean lock);
}
