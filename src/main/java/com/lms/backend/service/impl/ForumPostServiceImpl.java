package com.lms.backend.service.impl;

import com.lms.backend.dto.ForumPostDto;
import com.lms.backend.dto.ForumPostRequest;
import com.lms.backend.model.ForumPost;
import com.lms.backend.model.User;
import com.lms.backend.repository.ForumPostRepository;
import com.lms.backend.repository.UserRepository;
import com.lms.backend.service.ForumPostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ForumPostServiceImpl implements ForumPostService {

    private final ForumPostRepository forumPostRepository;
    private final UserRepository userRepository;

    @Override
    public ForumPostDto createPost(ForumPostRequest request) {
        log.info("START createPost: content={}, userId={}, parentId={}",
                request.getContent(), request.getUserId(), request.getParentPostId());

        try {
            if (request.getUserId() == null) {
                throw new RuntimeException("userId is missing");
            }

            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found: " + request.getUserId()));

            ForumPost parentPost = null;
            if (request.getParentPostId() != null) {
                parentPost = forumPostRepository.findById(request.getParentPostId())
                        .orElseThrow(() -> new RuntimeException("Parent not found: " + request.getParentPostId()));
            }

            ForumPost post = new ForumPost();
            post.setContent(request.getContent());
            post.setAuthor(user);
            post.setParentPost(parentPost);
            post.setLocked(false);
            post.setCreatedAt(LocalDateTime.now());

            log.info("Saving ForumPost...");
            ForumPost saved = forumPostRepository.save(post);
            log.info("Saved ForumPost with ID: {}", saved.getId());

            return mapToDtoManualSimple(saved);
        } catch (Exception e) {
            log.error("Error in createPost", e);
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public List<ForumPostDto> getAllTopLevelPosts() {
        log.info("Fetching all top-level posts");
        return forumPostRepository.findByParentPostIsNullOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToDtoManual)
                .collect(Collectors.toList());
    }

    @Override
    public void deletePost(Long postId) {
        forumPostRepository.deleteById(postId);
    }

    @Override
    public ForumPostDto lockPost(Long postId, boolean lock) {
        ForumPost post = forumPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setLocked(lock);
        return mapToDtoManualSimple(forumPostRepository.save(post));
    }

    private ForumPostDto mapToDtoManual(ForumPost post) {
        if (post == null)
            return null;

        ForumPostDto dto = mapToDtoManualSimple(post);

        if (post.getReplies() != null) {
            for (ForumPost reply : post.getReplies()) {
                dto.getReplies().add(mapToDtoManual(reply));
            }
        }

        return dto;
    }

    private ForumPostDto mapToDtoManualSimple(ForumPost post) {
        String roleName = "STUDENT";
        if (post.getAuthor() != null && post.getAuthor().getRole() != null) {
            roleName = post.getAuthor().getRole().getName().name();
        }

        ForumPostDto dto = new ForumPostDto(
                post.getId(),
                post.getContent(),
                post.getAuthor() != null ? post.getAuthor().getId() : null,
                post.getAuthor() != null ? post.getAuthor().getUsername() : "Unknown",
                roleName,
                post.getCreatedAt(),
                post.isLocked());
        return dto;
    }
}
