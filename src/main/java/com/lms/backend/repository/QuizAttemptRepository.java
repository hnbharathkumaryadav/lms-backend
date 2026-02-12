package com.lms.backend.repository;

import com.lms.backend.model.QuizAttempt;
import com.lms.backend.model.User;
import com.lms.backend.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByStudentAndQuiz(User student, Quiz quiz);

    List<QuizAttempt> findByStudentId(Long studentId);

    List<QuizAttempt> findByQuiz(Quiz quiz);
}
