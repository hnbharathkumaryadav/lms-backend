package com.lms.backend.service.impl;

import com.lms.backend.controller.AdminController;
import com.lms.backend.dto.CourseDto;
import com.lms.backend.model.Course;
import com.lms.backend.model.Role;
import com.lms.backend.model.User;
import com.lms.backend.repository.CourseRepository;
import com.lms.backend.repository.RoleRepository;
import com.lms.backend.repository.EnrollmentRepository;
import com.lms.backend.repository.UserRepository;
import com.lms.backend.service.AdminService;
import com.lms.backend.util.CourseMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private com.lms.backend.service.ActivityService activityService;

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User createUser(AdminController.CreateUserRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists: " + request.getEmail());
        }

        // Determine role
        String roleName = request.getRole() != null ? request.getRole() : "ROLE_STUDENT";

        Role.RoleName roleEnum;
        try {
            roleEnum = Role.RoleName.valueOf(roleName.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role name: " + roleName);
        }

        // Fetch role from DB
        Role role = roleRepository.findByName(roleEnum)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

        // Create user
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();

        User savedUser = userRepository.save(user);
        activityService.logActivity("USER", "New user registered: " + savedUser.getUsername(), "👤");
        return savedUser;
    }

    @Override
    public List<CourseDto> getPendingCourses() {
        // Return all courses that are not approved yet
        List<Course> pendingCourses = courseRepository.findByApprovedFalse();
        return pendingCourses.stream()
                .map(CourseMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public CourseDto approveCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        course.setApproved(true);
        Course approvedCourse = courseRepository.save(course);

        activityService.logActivity("COURSE", "Course approved: " + approvedCourse.getTitle(), "✅");

        return CourseMapper.toDto(approvedCourse);
    }

    @Override
    public CourseDto rejectCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Option 1: Delete the course
        activityService.logActivity("COURSE", "Course rejected: " + course.getTitle(), "❌");
        courseRepository.delete(course);

        // Option 2: Or just mark as rejected (if you have rejected field)
        // course.setRejected(true);
        // Course rejectedCourse = courseRepository.save(course);
        return CourseMapper.toDto(course);
    }

    @Override
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found with id: " + userId);
        }
        userRepository.deleteById(userId);
        activityService.logActivity("USER", "User deleted (ID: " + userId + ")", "🗑️");
    }

    @Override
    public User updateUserRole(Long userId, String roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Role.RoleName roleEnum;
        try {
            roleEnum = Role.RoleName.valueOf(roleName.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role name: " + roleName);
        }

        Role role = roleRepository.findByName(roleEnum)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

        user.setRole(role);
        User savedUser = userRepository.save(user);
        activityService.logActivity("USER", "User role updated: " + savedUser.getUsername() + " -> " + roleName, "🔄");
        return savedUser;
    }

    @Override
    public Map<String, Object> getAdminStats() {
        long totalUsers = userRepository.count();
        long totalCourses = courseRepository.count();

        // Count pending courses (not approved)
        long pendingCourses = courseRepository.countByApprovedFalse();

        // Count users by role
        long totalStudents = userRepository.countByRoleName(Role.RoleName.ROLE_STUDENT);
        long totalInstructors = userRepository.countByRoleName(Role.RoleName.ROLE_INSTRUCTOR);
        long totalAdmins = userRepository.countByRoleName(Role.RoleName.ROLE_ADMIN);
        long totalEnrollments = enrollmentRepository.count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("totalCourses", totalCourses);
        stats.put("pendingApprovals", pendingCourses);
        stats.put("totalStudents", totalStudents);
        stats.put("totalInstructors", totalInstructors);
        stats.put("totalAdmins", totalAdmins);
        stats.put("totalEnrollments", totalEnrollments);

        return stats;
    }

    @Override
    public List<Map<String, Object>> getRecentActivity() {
        return activityService.getRecentActivities();
    }

    // ✅ HELPER METHOD FOR TIME FORMAT
    private String formatTimeAgo(LocalDateTime dateTime) {
        if (dateTime == null) {
            return "Recently";
        }
        return dateTime.toLocalDate().toString();
    }
}