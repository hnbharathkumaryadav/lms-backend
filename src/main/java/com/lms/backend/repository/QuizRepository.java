package com.lms.backend.repository;

import com.lms.backend.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    Optional<Quiz> findByLessonId(Long lessonId);

    Optional<Quiz> findByLesson(com.lms.backend.model.Lesson lesson);
}
