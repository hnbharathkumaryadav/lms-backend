package com.lms.backend.controller;

import com.lms.backend.dto.ForumPostDto;
import com.lms.backend.dto.ForumPostRequest;
import com.lms.backend.service.ForumPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/forum")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ForumPostController {

    private final ForumPostService forumPostService;

    @GetMapping
    public ResponseEntity<List<ForumPostDto>> getAllPosts() {
        return ResponseEntity.ok(forumPostService.getAllTopLevelPosts());
    }

    @PostMapping
    public ResponseEntity<ForumPostDto> createPost(@RequestBody ForumPostRequest request) {
        return ResponseEntity.ok(forumPostService.createPost(request));
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable Long postId) {
        forumPostService.deletePost(postId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{postId}/lock")
    public ResponseEntity<ForumPostDto> lockPost(
            @PathVariable Long postId,
            @RequestParam boolean lock) {
        return ResponseEntity.ok(forumPostService.lockPost(postId, lock));
    }
}
