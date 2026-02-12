package com.lms.backend.service.impl;

import com.lms.backend.model.*;
import com.lms.backend.repository.*;
import com.lms.backend.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseServiceImpl implements CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private LessonProgressRepository lessonProgressRepository;

    @Autowired
    private CertificateRepository certificateRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuizAttemptRepository quizAttemptRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private com.lms.backend.service.ActivityService activityService;

    @Override
    public Course createCourse(Course course) {
        Course saved = courseRepository.save(course);
        activityService.logActivity("COURSE", "New course created: " + saved.getTitle(), "📚");
        return saved;
    }

    @Override
    public Course updateCourse(Long id, Course updatedCourse) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        course.setTitle(updatedCourse.getTitle());
        course.setDescription(updatedCourse.getDescription());
        course.setCoverImageUrl(updatedCourse.getCoverImageUrl());

        // Check approval status change
        boolean approvalChanged = course.isApproved() != updatedCourse.isApproved();
        course.setApproved(updatedCourse.isApproved());

        Course savedCourse = courseRepository.save(course);

        if (approvalChanged) {
            String message = savedCourse.isApproved() ? "Course approved: " + savedCourse.getTitle()
                    : "Course unapproved: " + savedCourse.getTitle();
            String icon = savedCourse.isApproved() ? "✅" : "⚠️";
            activityService.logActivity("COURSE", message, icon);
        } else {
            activityService.logActivity("COURSE", "Course updated: " + savedCourse.getTitle(), "📝");
        }

        System.out.println("Updated course - ID: " + savedCourse.getId() + ", Approved: " + savedCourse.isApproved());
        return savedCourse;
    }

    @Override
    @Transactional
    public void deleteCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // 1. Log activity
        activityService.logActivity("COURSE", "Course deleted: " + course.getTitle(), "🗑️");

        // 2. Cleanup related entities (manual cleanup for deep relationships)

        // Cleanup Certificates
        List<Certificate> certificates = certificateRepository.findByCourse(course);
        certificateRepository.deleteAll(certificates);

        // Cleanup Lessons and their associations
        List<Lesson> lessons = lessonRepository.findByCourse(course);
        for (Lesson lesson : lessons) {
            // Cleanup LessonProgress
            List<LessonProgress> progress = lessonProgressRepository.findByLesson(lesson);
            lessonProgressRepository.deleteAll(progress);

            // Cleanup Quizzes and Attempts
            quizRepository.findByLesson(lesson).ifPresent(quiz -> {
                List<QuizAttempt> attempts = quizAttemptRepository.findByQuiz(quiz);
                quizAttemptRepository.deleteAll(attempts);
                quizRepository.delete(quiz);
            });
        }

        // 3. Delete Course (Cascades to Lessons & Enrollments in JPA entity)
        courseRepository.delete(course);
    }

    @Override
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    @Override
    public Course getCourseById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
    }
}
