package com.lms.backend.service.impl;

import com.lms.backend.model.*;
import com.lms.backend.repository.*;
import com.lms.backend.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StudentServiceImpl implements StudentService {

        @Autowired
        private CourseRepository courseRepository;

        @Autowired
        private EnrollmentRepository enrollmentRepository;

        @Autowired
        private LessonRepository lessonRepository;

        @Autowired
        private LessonProgressRepository lessonProgressRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private CertificateRepository certificateRepository;

        @Override
        public List<Course> getCourseCatalog() {
                // Return all approved courses
                return courseRepository.findByApprovedTrue();
        }

        @Override
        public void enrollCourse(User student, Long courseId) {
                Course course = courseRepository.findById(courseId)
                                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + courseId));

                boolean alreadyEnrolled = enrollmentRepository.existsByStudentAndCourse(student, course);
                if (alreadyEnrolled) {
                        throw new RuntimeException("You are already enrolled in this course");
                }

                if (!course.isApproved()) {
                        throw new RuntimeException("This course is not approved for enrollment");
                }

                Enrollment enrollment = Enrollment.builder()
                                .student(student)
                                .course(course)
                                .enrolledAt(LocalDateTime.now())
                                .progress(0.0)
                                .build();

                enrollmentRepository.save(enrollment);

                System.out.println("Student " + student.getEmail() + " enrolled in course: " + course.getTitle());
        }

        @Override
        public List<Course> getEnrolledCourses(User student) {
                // Use findByStudent method for results
                System.out.println("Getting enrolled courses for student: " + student.getEmail() + " (ID: "
                                + student.getId() + ")");

                List<Enrollment> enrollments = enrollmentRepository.findByStudent(student);
                List<Course> courses = enrollments.stream()
                                .map(Enrollment::getCourse)
                                .collect(Collectors.toList());

                System.out.println(
                                "📚 Found " + courses.size() + " enrolled courses for student: " + student.getEmail());

                // Debug: Print course details
                for (Course course : courses) {
                        System.out.println(" Course: " + course.getTitle() + " (ID: " + course.getId() + ")");
                }

                return courses;
        }

        @Override
        public Map<String, Object> getCourseWithProgress(User student, Long courseId) {
                Course course = courseRepository.findById(courseId)
                                .orElseThrow(() -> new RuntimeException("Course not found"));

                Enrollment enrollment = enrollmentRepository.findByStudentAndCourse(student, course)
                                .orElseThrow(() -> new RuntimeException("You are not enrolled in this course"));

                List<Lesson> lessons = lessonRepository.findByCourseOrderByPositionAsc(course);
                List<LessonProgress> lessonProgresses = lessonProgressRepository.findByStudentAndLesson_Course(student,
                                course);

                long completedLessons = lessonProgresses.stream()
                                .filter(LessonProgress::isCompleted)
                                .map(lp -> lp.getLesson().getId())
                                .distinct()
                                .count();

                double progress = lessons.isEmpty() ? 0 : (double) completedLessons / lessons.size() * 100;

                enrollment.setProgress(progress);
                enrollmentRepository.save(enrollment);

                // Generate certificate if course completed (Robustness check)
                if (progress >= 100) {
                        generateCertificateIfMissing(student, course);
                }

                Map<String, Object> response = new HashMap<>();
                response.put("course", course);
                response.put("lessons", lessons);
                response.put("enrollment", enrollment);
                response.put("completedLessons", completedLessons);
                response.put("totalLessons", lessons.size());
                response.put("progress", progress);
                response.put("lessonProgresses", lessonProgresses);

                return response;
        }

        @Override
        public void markLessonCompleted(User student, Long courseId, Long lessonId) {
                Lesson lesson = lessonRepository.findById(lessonId)
                                .orElseThrow(() -> new RuntimeException("Lesson not found"));

                if (!lesson.getCourse().getId().equals(courseId)) {
                        throw new RuntimeException("Lesson does not belong to the specified course");
                }

                Enrollment enrollment = enrollmentRepository.findByStudentAndCourse(student, lesson.getCourse())
                                .orElseThrow(() -> new RuntimeException("You are not enrolled in this course"));

                LessonProgress progress = lessonProgressRepository
                                .findByStudentAndLesson(student, lesson)
                                .orElse(new LessonProgress());

                progress.setStudent(student);
                progress.setLesson(lesson);
                progress.setCompleted(true);
                progress.setCompletedAt(LocalDateTime.now());
                progress.setLastAccessedAt(LocalDateTime.now());

                lessonProgressRepository.save(progress);
                updateCourseProgress(student, lesson.getCourse());
        }

        @Override
        public void trackTime(User student, Long courseId, Long seconds) {
                Course course = courseRepository.findById(courseId)
                                .orElseThrow(() -> new RuntimeException("Course not found"));

                Enrollment enrollment = enrollmentRepository.findByStudentAndCourse(student, course)
                                .orElseThrow(() -> new RuntimeException("You are not enrolled in this course"));

                Long currentTime = enrollment.getTimeSpentSeconds();
                if (currentTime == null)
                        currentTime = 0L;

                enrollment.setTimeSpentSeconds(currentTime + seconds);
                enrollmentRepository.save(enrollment);
        }

        @Override
        public Map<String, Object> getLearningStats(User student) {
                System.out.println("Getting learning stats for student: " + student.getEmail() + " (ID: "
                                + student.getId() + ")");

                List<Enrollment> enrollments = enrollmentRepository.findByStudent(student);

                System.out.println("STATS DEBUG: Found " + enrollments.size() + " enrollments for student "
                                + student.getEmail());
                long totalCourses = enrollments.size();
                long completedCourses = enrollments.stream()
                                .filter(e -> e.getProgress() >= 100)
                                .count();
                long inProgressCourses = enrollments.stream()
                                .filter(e -> e.getProgress() > 0 && e.getProgress() < 100)
                                .count();

                // Calculate total completed lessons
                long totalCompletedLessons = 0;
                long totalSeconds = 0;
                for (Enrollment enrollment : enrollments) {
                        List<LessonProgress> progressList = lessonProgressRepository
                                        .findByStudentAndLesson_Course(student, enrollment.getCourse());
                        totalCompletedLessons += progressList.stream()
                                        .filter(LessonProgress::isCompleted)
                                        .count();

                        Long spent = enrollment.getTimeSpentSeconds();
                        if (spent != null)
                                totalSeconds += spent;
                }

                // Convert seconds to hours for dashboard (with 1 decimal point)
                double totalLearningHours = Math.round((totalSeconds / 3600.0) * 10.0) / 10.0;
                int learningStreak = calculateLearningStreak(student);

                Map<String, Object> stats = new HashMap<>();
                stats.put("totalCourses", totalCourses);
                stats.put("completedCourses", completedCourses);
                stats.put("inProgressCourses", inProgressCourses);
                stats.put("totalLearningHours", totalLearningHours);
                stats.put("learningStreak", learningStreak);
                stats.put("totalEnrollments", totalCourses);
                stats.put("completedLessons", totalCompletedLessons);
                double overallProgress = totalCourses > 0
                                ? enrollments.stream().mapToDouble(Enrollment::getProgress).average().orElse(0.0)
                                : 0.0;
                stats.put("overallProgressPercentage", Math.round(overallProgress * 100.0) / 100.0);
                stats.put("certificates", completedCourses);

                System.out.println("Stats calculated - Total courses: " + totalCourses + ", Completed: "
                                + completedCourses);

                return stats;
        }

        @Override
        public Map<String, Object> getCourseProgress(User student, Long courseId) {
                Course course = courseRepository.findById(courseId)
                                .orElseThrow(() -> new RuntimeException("Course not found"));

                Enrollment enrollment = enrollmentRepository.findByStudentAndCourse(student, course)
                                .orElseThrow(() -> new RuntimeException("You are not enrolled in this course"));

                List<Lesson> lessons = lessonRepository.findByCourseOrderByPositionAsc(course);
                List<LessonProgress> lessonProgresses = lessonProgressRepository.findByStudentAndLesson_Course(student,
                                course);

                Map<String, Object> progress = new HashMap<>();
                progress.put("course", course);
                progress.put("enrollment", enrollment);
                progress.put("totalLessons", lessons.size());
                progress.put("completedLessons", lessonProgresses.stream().filter(LessonProgress::isCompleted).count());
                progress.put("progressPercentage", enrollment.getProgress());
                progress.put("lessons", lessons.stream().map(lesson -> {
                        Map<String, Object> lessonMap = new HashMap<>();
                        lessonMap.put("id", lesson.getId());
                        lessonMap.put("title", lesson.getTitle());
                        lessonMap.put("duration", lesson.getDurationSeconds());
                        lessonMap.put("position", lesson.getPosition());

                        boolean isCompleted = lessonProgresses.stream()
                                        .anyMatch(lp -> lp.getLesson().getId().equals(lesson.getId())
                                                        && lp.isCompleted());
                        lessonMap.put("isCompleted", isCompleted);

                        return lessonMap;
                }).collect(Collectors.toList()));

                return progress;
        }

        @Override
        public List<Course> getAvailableCourses(User student) {
                List<Course> allApprovedCourses = courseRepository.findByApprovedTrue();
                List<Course> enrolledCourses = getEnrolledCourses(student);

                List<Course> availableCourses = allApprovedCourses.stream()
                                .filter(course -> enrolledCourses.stream()
                                                .noneMatch(enrolled -> enrolled.getId().equals(course.getId())))
                                .collect(Collectors.toList());

                System.out.println(" Available courses for " + student.getEmail() + ": " + availableCourses.size());

                return availableCourses;
        }

        private void updateCourseProgress(User student, Course course) {
                List<Lesson> lessons = lessonRepository.findByCourseOrderByPositionAsc(course);
                List<LessonProgress> progressList = lessonProgressRepository.findByStudentAndLesson_Course(student,
                                course);

                long completedLessons = progressList.stream()
                                .filter(LessonProgress::isCompleted)
                                .map(lp -> lp.getLesson().getId())
                                .distinct()
                                .count();

                double progress = lessons.isEmpty() ? 0 : (double) completedLessons / lessons.size() * 100;

                Enrollment enrollment = enrollmentRepository.findByStudentAndCourse(student, course)
                                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

                enrollment.setProgress(progress);
                enrollmentRepository.save(enrollment);

                System.out.println("Updated progress for " + student.getEmail() + " in " + course.getTitle() + ": "
                                + progress + "%");

                // Generate certificate if course completed
                if (progress >= 100) {
                        generateCertificateIfMissing(student, course);
                }
        }

        private void generateCertificateIfMissing(User student, Course course) {
                // Check if certificate already exists
                if (certificateRepository.findByStudentAndCourse_Id(student, course.getId()).isPresent()) {
                        return;
                }

                String code = "CERT-" + System.currentTimeMillis() + "-" + Math.abs(new Random().nextInt(1000));

                Certificate certificate = Certificate.builder()
                                .student(student)
                                .course(course)
                                .issueDate(LocalDateTime.now())
                                .certificateCode(code)
                                .studentName(student.getUsername())
                                .courseName(course.getTitle())
                                .build();

                certificateRepository.save(certificate);
                System.out.println("🎓 Certificate generated for " + student.getEmail() + " in course: "
                                + course.getTitle());
        }

        private int calculateLearningStreak(User student) {
                // Check if student has any lesson progress or enrollment today
                List<Enrollment> enrollments = enrollmentRepository.findByStudent(student);
                boolean activeToday = enrollments.stream()
                                .anyMatch(e -> e.getEnrolledAt() != null
                                                && e.getEnrolledAt().toLocalDate().equals(java.time.LocalDate.now()));

                if (!activeToday) {
                        List<LessonProgress> progresses = lessonProgressRepository.findByStudent(student);
                        activeToday = progresses.stream()
                                        .anyMatch(p -> p.getLastAccessedAt() != null
                                                        && p.getLastAccessedAt().toLocalDate()
                                                                        .equals(java.time.LocalDate.now()));
                }

                return activeToday ? 1 : 0;
        }
}