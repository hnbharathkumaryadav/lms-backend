package com.lms.backend.controller;

import com.lms.backend.dto.CourseDto;
import com.lms.backend.model.Course;
import com.lms.backend.model.Enrollment;
import com.lms.backend.model.LessonProgress;
import com.lms.backend.model.User;
import com.lms.backend.service.AuthService;
import com.lms.backend.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "*")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private AuthService authService;

    @Autowired
    private com.lms.backend.repository.EnrollmentRepository enrollmentRepository;

    // Enroll student in a course Prevents duplicate enrollments
    @PostMapping("/enroll/{courseId}")
    public ResponseEntity<?> enrollCourse(@PathVariable Long courseId) {
        try {
            User currentUser = authService.getCurrentUser();
            studentService.enrollCourse(currentUser, courseId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "✅ Enrolled successfully in course",
                    "courseId", courseId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()));
        }
    }

    // Get all enrolled courses for current student
    @GetMapping("/my-courses")
    public ResponseEntity<List<CourseDto>> getMyCourses() {
        User currentUser = authService.getCurrentUser();
        List<Enrollment> enrollments = enrollmentRepository.findByStudent(currentUser);
        List<CourseDto> courseDtos = enrollments.stream()
                .map(enrollment -> {
                    CourseDto dto = convertToDto(enrollment.getCourse());
                    dto.setProgress(enrollment.getProgress());
                    return dto;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(courseDtos);
    }

    private CourseDto convertToDto(Course course) {
        return CourseDto.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .coverImageUrl(course.getCoverImageUrl())
                .price(course.getPrice())
                .approved(course.isApproved())
                .level(course.getLevel())
                .duration(course.getDuration())
                .rating(course.getRating())
                .rating(course.getRating())
                .totalStudents(course.getEnrollmentCount())
                .categoryId(course.getCategory() != null ? course.getCategory().getId() : null)
                .categoryId(course.getCategory() != null ? course.getCategory().getId() : null)
                .categoryName(course.getCategory() != null ? course.getCategory().getName() : null)
                .instructorId(course.getInstructor().getId())
                .instructorName(course.getInstructor().getUsername())
                .build();
    }

    // Get course details with enrollment info
    @GetMapping("/course/{courseId}")
    public ResponseEntity<?> getCourseWithProgress(@PathVariable Long courseId) {
        try {
            User currentUser = authService.getCurrentUser();
            Map<String, Object> courseWithProgress = studentService.getCourseWithProgress(currentUser, courseId);

            // Add completed lesson IDs for frontend ease of use
            @SuppressWarnings("unchecked")
            List<LessonProgress> progresses = (List<LessonProgress>) courseWithProgress.get("lessonProgresses");
            List<Long> completedLessonIds = progresses.stream()
                    .filter(LessonProgress::isCompleted)
                    .map(lp -> lp.getLesson().getId())
                    .distinct()
                    .collect(Collectors.toList());
            courseWithProgress.put("completedLessonIds", completedLessonIds);

            return ResponseEntity.ok(courseWithProgress);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Mark lesson as completed
    @PostMapping("/course/{courseId}/lesson/{lessonId}/complete")
    public ResponseEntity<?> markLessonCompleted(
            @PathVariable Long courseId,
            @PathVariable Long lessonId) {
        try {
            User currentUser = authService.getCurrentUser();
            studentService.markLessonCompleted(currentUser, courseId, lessonId);
            Map<String, Object> progressRes = studentService.getCourseProgress(currentUser, courseId);
            // Map the results for frontend sync
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> lessonsRes = (List<Map<String, Object>>) progressRes.get("lessons");
            List<Long> completedIds = lessonsRes.stream()
                    .filter(l -> (Boolean) l.get("isCompleted"))
                    .map(l -> {
                        Object idValue = l.get("id");
                        if (idValue instanceof Integer)
                            return ((Integer) idValue).longValue();
                        return (Long) idValue;
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Lesson marked as completed",
                    "progress", progressRes.get("progressPercentage"),
                    "completedLessonIds", completedIds));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()));
        }
    }

    @PostMapping("/course/{courseId}/track-time")
    public ResponseEntity<?> trackTime(
            @PathVariable Long courseId,
            @RequestBody Map<String, Long> payload) {
        try {
            User currentUser = authService.getCurrentUser();
            Long seconds = payload.getOrDefault("seconds", 30L);
            studentService.trackTime(currentUser, courseId, seconds);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // Get student learning statistics
    @GetMapping("/stats")
    public ResponseEntity<?> getLearningStats() {
        try {
            User currentUser = authService.getCurrentUser();
            System.out.println("Processing stats for " + currentUser.getEmail());
            Map<String, Object> stats = studentService.getLearningStats(currentUser);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            System.err.println("ERROR calculating student stats: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Error calculating learning statistics: " + e.getMessage()));
        }
    }

    // Get course progress
    @GetMapping("/course/{courseId}/progress")
    public ResponseEntity<Map<String, Object>> getCourseProgress(@PathVariable Long courseId) {
        User currentUser = authService.getCurrentUser();
        Map<String, Object> progress = studentService.getCourseProgress(currentUser, courseId);
        return ResponseEntity.ok(progress);
    }

    // Get available courses (not enrolled)
    @GetMapping("/courses/available")
    public ResponseEntity<List<Course>> getAvailableCourses() {
        User currentUser = authService.getCurrentUser();
        List<Course> availableCourses = studentService.getAvailableCourses(currentUser);
        return ResponseEntity.ok(availableCourses);
    }

    // Get Avail Categories
    @GetMapping("/catalog")
    public List<Course> getCourseCatalog() {
        return studentService.getCourseCatalog();
    }
}