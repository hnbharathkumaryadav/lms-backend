package com.lms.backend.service;

import com.lms.backend.model.Quiz;
import com.lms.backend.model.User;

import java.util.Map;

public interface QuizService {
    Quiz getQuizByLesson(Long lessonId);

    Map<String, Object> submitQuiz(User student, Long quizId, Map<Long, Integer> answers);

    Quiz saveQuiz(Long lessonId, Quiz quiz);
}
