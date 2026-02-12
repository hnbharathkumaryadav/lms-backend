package com.lms.backend.service.impl;

import com.lms.backend.model.*;
import com.lms.backend.repository.LessonRepository;
import com.lms.backend.repository.QuizAttemptRepository;
import com.lms.backend.repository.QuizRepository;
import com.lms.backend.service.QuizService;
import com.lms.backend.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class QuizServiceImpl implements QuizService {

    private final QuizRepository quizRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final StudentService studentService;
    private final LessonRepository lessonRepository;

    @Override
    public Quiz getQuizByLesson(Long lessonId) {
        return quizRepository.findByLessonId(lessonId)
                .orElseThrow(() -> new RuntimeException("No quiz found for this lesson"));
    }

    @Override
    @Transactional
    public Map<String, Object> submitQuiz(User student, Long quizId, Map<Long, Integer> answers) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        int totalQuestions = quiz.getQuestions().size();
        if (totalQuestions == 0) {
            throw new RuntimeException("Quiz has no questions");
        }

        int correctAnswers = 0;
        java.util.List<Map<String, Object>> questionResults = new java.util.ArrayList<>();

        for (Question question : quiz.getQuestions()) {
            Integer studentAnswer = answers.get(question.getId());
            boolean isCorrect = studentAnswer != null && studentAnswer.equals(question.getCorrectOptionIndex());
            if (isCorrect) {
                correctAnswers++;
            }

            Map<String, Object> result = new java.util.HashMap<>();
            result.put("questionId", question.getId());
            result.put("questionText", question.getText());
            result.put("studentAnswer", studentAnswer);
            result.put("correctAnswer", question.getCorrectOptionIndex());
            result.put("isCorrect", isCorrect);
            questionResults.add(result);
        }

        double score = (double) correctAnswers / totalQuestions * 100;
        boolean passed = score >= quiz.getPassingScore();

        QuizAttempt attempt = QuizAttempt.builder()
                .student(student)
                .quiz(quiz)
                .score(score)
                .passed(passed)
                .completedAt(LocalDateTime.now())
                .build();

        quizAttemptRepository.save(attempt);

        // If passed, mark the lesson as completed
        if (passed) {
            studentService.markLessonCompleted(student, quiz.getLesson().getCourse().getId(), quiz.getLesson().getId());
        }

        Map<String, Object> response = new java.util.HashMap<>();
        response.put("attempt", attempt);
        response.put("passed", passed);
        response.put("score", score);
        response.put("correctCount", correctAnswers);
        response.put("totalCount", totalQuestions);
        response.put("results", questionResults);

        return response;
    }

    @Override
    @Transactional
    public Quiz saveQuiz(Long lessonId, Quiz quizData) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        Quiz quiz = quizRepository.findByLessonId(lessonId).orElse(new Quiz());
        quiz.setLesson(lesson);
        quiz.setPassingScore(quizData.getPassingScore());

        // Clear existing questions and add new ones to maintain relationship
        if (quiz.getQuestions() == null) {
            quiz.setQuestions(new java.util.ArrayList<>());
        } else {
            quiz.getQuestions().clear();
        }

        for (Question q : quizData.getQuestions()) {
            q.setQuiz(quiz);
            quiz.getQuestions().add(q);
        }

        return quizRepository.save(quiz);
    }
}
