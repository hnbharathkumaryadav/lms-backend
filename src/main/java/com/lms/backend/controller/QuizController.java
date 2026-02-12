package com.lms.backend.controller;

import com.lms.backend.model.Quiz;
import com.lms.backend.model.User;
import com.lms.backend.repository.UserRepository;
import com.lms.backend.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class QuizController {

    private final QuizService quizService;
    private final UserRepository userRepository;

    @GetMapping("/lesson/{lessonId}")
    public ResponseEntity<Quiz> getQuizByLesson(@PathVariable Long lessonId) {
        try {
            System.out.println("QUIZ DEBUG: Fetching quiz for lesson: " + lessonId);
            Quiz quiz = quizService.getQuizByLesson(lessonId);
            System.out.println("QUIZ DEBUG: Found quiz: " + quiz.getId());
            return ResponseEntity.ok(quiz);
        } catch (Exception e) {
            System.out.println(
                    "QUIZ DEBUG: No quiz found for lesson " + lessonId + " or error occurred: " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{quizId}/submit")
    public ResponseEntity<Map<String, Object>> submitQuiz(
            @PathVariable Long quizId,
            @RequestBody Map<Long, Integer> answers,
            @AuthenticationPrincipal UserDetails userDetails) {

        User student = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(quizService.submitQuiz(student, quizId, answers));
    }

    @PostMapping("/lesson/{lessonId}")
    public ResponseEntity<Quiz> saveQuiz(
            @PathVariable Long lessonId,
            @RequestBody Quiz quiz) {
        return ResponseEntity.ok(quizService.saveQuiz(lessonId, quiz));
    }
}
