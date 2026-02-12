package com.lms.backend.config;

import com.lms.backend.model.*;
import com.lms.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Component
public class DataSeeder implements CommandLineRunner {

        @Autowired
        private RoleRepository roleRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private CourseRepository courseRepository;

        @Autowired
        private LessonRepository lessonRepository;

        @Autowired
        private EnrollmentRepository enrollmentRepository;

        @Autowired
        private CategoryRepository categoryRepository;

        @Autowired
        private QuizRepository quizRepository;

        @Autowired
        private QuestionRepository questionRepository;

        @Autowired
        private PasswordEncoder passwordEncoder;

        @Override
        public void run(String... args) throws Exception {
                System.out.println("🚀 Starting Data Seeding...");

                try {

                        // 1. Create Roles (Always check if exists)
                        createRoles();

                        // 2. Create Categories (Only if not exists)
                        createCategories();

                        // 3. Create Default Users (Only if not exists)
                        createDefaultUsers();

                        // 4. Create Sample Courses & Lessons (Only if no courses exist)
                        createSampleCourses();

                        // 5. Create Sample Enrollments (Only if no enrollments exist)
                        createSampleEnrollments();

                        // 6. Create Sample Quizzes (Only if no quizzes exist)
                        createSampleQuizzes();

                        // 7. Update existing users/courses with missing audit fields
                        updateMissingAuditFields();

                        System.out.println("🎉 Data Seeding Completed Successfully!");

                } catch (Exception e) {
                        System.err.println("❌ Data Seeding Failed: " + e.getMessage());
                        e.printStackTrace();
                }
        }

        private void createRoles() {
                try {
                        if (roleRepository.count() == 0) {
                                List<Role> roles = Arrays.asList(
                                                Role.builder().name(Role.RoleName.ROLE_ADMIN).build(),
                                                Role.builder().name(Role.RoleName.ROLE_INSTRUCTOR).build(),
                                                Role.builder().name(Role.RoleName.ROLE_STUDENT).build());

                                roleRepository.saveAll(roles);
                                System.out.println("✅ Default roles created: ADMIN, INSTRUCTOR, STUDENT");
                        } else {
                                System.out.println("ℹ️ Roles already exist in database");
                        }
                } catch (Exception e) {
                        System.err.println("❌ Error creating roles: " + e.getMessage());
                        throw e;
                }
        }

        private void createCategories() {
                try {
                        if (categoryRepository.count() == 0) {
                                List<Category> categories = Arrays.asList(
                                                Category.builder().name("Full Stack")
                                                                .description("Full stack web development courses")
                                                                .build(),
                                                Category.builder().name("Development Tools")
                                                                .description("Development tools and version control")
                                                                .build(),
                                                Category.builder().name("Data Science")
                                                                .description("Data analysis, ML and AI courses")
                                                                .build(),
                                                Category.builder().name("Mobile Development")
                                                                .description("Android and iOS app development")
                                                                .build(),
                                                Category.builder().name("Cloud Computing")
                                                                .description("AWS, Azure, GCP cloud courses").build(),
                                                Category.builder().name("Design")
                                                                .description("UI/UX design and graphics courses")
                                                                .build(),
                                                Category.builder().name("DevOps")
                                                                .description("CI/CD, Docker, Kubernetes courses")
                                                                .build(),
                                                Category.builder().name("AI/ML").description(
                                                                "Artificial Intelligence and Machine Learning")
                                                                .build(),
                                                Category.builder().name("Security")
                                                                .description("Cyber security and ethical hacking")
                                                                .build(),
                                                Category.builder().name("Programming")
                                                                .description("Programming languages and coding courses")
                                                                .build());
                                categoryRepository.saveAll(categories);
                                System.out.println(
                                                "✅ Default categories created: " + categories.size() + " categories");
                        } else {
                                System.out.println("ℹ️ Categories already exist in database");
                        }
                } catch (Exception e) {
                        System.err.println("❌ Error creating categories: " + e.getMessage());
                        throw e;
                }
        }

        private void createDefaultUsers() {
                try {
                        int usersCreated = 0;

                        // Admin User - Rachit Sharma
                        if (!userRepository.existsByEmail("rachit.adm@lms.com")) {
                                Role adminRole = roleRepository.findByName(Role.RoleName.ROLE_ADMIN)
                                                .orElseThrow(() -> new RuntimeException("Admin role not found"));

                                User admin = User.builder()
                                                .username("Rachit Sharma")
                                                .email("rachit.adm@lms.com")
                                                .password(passwordEncoder.encode("rachit"))
                                                .role(adminRole)
                                                .createdAt(java.time.LocalDateTime.now())
                                                .build();
                                userRepository.save(admin);
                                usersCreated++;
                                System.out.println("✅ Admin user created: rachit.adm@lms.com / rachit");
                        }

                        // Instructor User - Rahul
                        if (!userRepository.existsByEmail("rahul.ins@lms.com")) {
                                Role instructorRole = roleRepository.findByName(Role.RoleName.ROLE_INSTRUCTOR)
                                                .orElseThrow(() -> new RuntimeException("Instructor role not found"));

                                User instructor = User.builder()
                                                .username("Rahul Kumar")
                                                .email("rahul.ins@lms.com")
                                                .password(passwordEncoder.encode("rahul"))
                                                .role(instructorRole)
                                                .createdAt(java.time.LocalDateTime.now())
                                                .build();
                                userRepository.save(instructor);
                                usersCreated++;
                                System.out.println("✅ Instructor user created: rahul.ins@lms.com / rahul");
                        }

                        // Student Users
                        createStudentUsers();

                        // Standard Admin
                        if (!userRepository.existsByEmail("admin@lms.com")) {
                                Role adminRole = roleRepository.findByName(Role.RoleName.ROLE_ADMIN)
                                                .orElseThrow(() -> new RuntimeException("Admin role not found"));
                                User admin = User.builder()
                                                .username("Admin User")
                                                .email("admin@lms.com")
                                                .password(passwordEncoder.encode("password"))
                                                .role(adminRole)
                                                .createdAt(java.time.LocalDateTime.now())
                                                .build();
                                userRepository.save(admin);
                                usersCreated++;
                                System.out.println("✅ Standard Admin created: admin@lms.com / password");
                        }

                        // Standard Instructor
                        if (!userRepository.existsByEmail("instructor@lms.com")) {
                                Role instructorRole = roleRepository.findByName(Role.RoleName.ROLE_INSTRUCTOR)
                                                .orElseThrow(() -> new RuntimeException("Instructor role not found"));
                                User instructor = User.builder()
                                                .username("Instructor User")
                                                .email("instructor@lms.com")
                                                .password(passwordEncoder.encode("password"))
                                                .role(instructorRole)
                                                .createdAt(java.time.LocalDateTime.now())
                                                .build();
                                userRepository.save(instructor);
                                usersCreated++;
                                System.out.println("✅ Standard Instructor created: instructor@lms.com / password");
                        }

                        // Standard Student
                        if (!userRepository.existsByEmail("student@lms.com")) {
                                Role studentRole = roleRepository.findByName(Role.RoleName.ROLE_STUDENT)
                                                .orElseThrow(() -> new RuntimeException("Student role not found"));
                                User student = User.builder()
                                                .username("Student User")
                                                .email("student@lms.com")
                                                .password(passwordEncoder.encode("password"))
                                                .role(studentRole)
                                                .createdAt(java.time.LocalDateTime.now())
                                                .build();
                                userRepository.save(student);
                                usersCreated++;
                                System.out.println("✅ Standard Student created: student@lms.com / password");
                        }

                        if (usersCreated == 0) {
                                System.out.println("ℹ️ All default users already exist");
                        }

                } catch (Exception e) {
                        System.err.println("❌ Error creating users: " + e.getMessage());
                        throw e;
                }
        }

        private void createStudentUsers() {
                try {
                        Role studentRole = roleRepository.findByName(Role.RoleName.ROLE_STUDENT)
                                        .orElseThrow(() -> new RuntimeException("Student role not found"));

                        List<User> students = Arrays.asList(
                                        User.builder().username("Komal Singh").email("komal@lms.com")
                                                        .password(passwordEncoder.encode("komal")).role(studentRole)
                                                        .createdAt(java.time.LocalDateTime.now())
                                                        .build(),
                                        User.builder().username("Kajal Verma").email("kajal@lms.com")
                                                        .password(passwordEncoder.encode("kajal")).role(studentRole)
                                                        .createdAt(java.time.LocalDateTime.now())
                                                        .build(),
                                        User.builder().username("Rohit Sharma").email("rohit@lms.com")
                                                        .password(passwordEncoder.encode("rohit")).role(studentRole)
                                                        .createdAt(java.time.LocalDateTime.now())
                                                        .build(),
                                        User.builder().username("Raushan Kumar").email("raushan@lms.com")
                                                        .password(passwordEncoder.encode("raushan")).role(studentRole)
                                                        .createdAt(java.time.LocalDateTime.now())
                                                        .build(),
                                        User.builder().username("Alexa Johnson").email("alexa@lms.com")
                                                        .password(passwordEncoder.encode("alexa")).role(studentRole)
                                                        .createdAt(java.time.LocalDateTime.now())
                                                        .build());

                        int created = 0;
                        for (User student : students) {
                                if (!userRepository.existsByEmail(student.getEmail())) {
                                        userRepository.save(student);
                                        created++;
                                        System.out.println("✅ Student created: " + student.getEmail());
                                }
                        }
                        if (created > 0) {
                                System.out.println("✅ " + created + " students created successfully");
                        }
                } catch (Exception e) {
                        System.err.println("❌ Error creating students: " + e.getMessage());
                }
        }

        private void createSampleCourses() {
                try {
                        if (courseRepository.count() == 0) {
                                // Get instructor
                                User instructor = userRepository.findByEmail("rahul.ins@lms.com")
                                                .orElseThrow(() -> new RuntimeException("Instructor not found"));

                                // Get categories
                                Category fullStackCat = categoryRepository.findByName("Full Stack")
                                                .orElseThrow(() -> new RuntimeException(
                                                                "Full Stack category not found"));
                                Category devToolsCat = categoryRepository.findByName("Development Tools")
                                                .orElseThrow(() -> new RuntimeException(
                                                                "Development Tools category not found"));
                                Category dataScienceCat = categoryRepository.findByName("Data Science")
                                                .orElseThrow(() -> new RuntimeException(
                                                                "Data Science category not found"));
                                Category mobileDevCat = categoryRepository.findByName("Mobile Development")
                                                .orElseThrow(() -> new RuntimeException(
                                                                "Mobile Development category not found"));
                                Category cloudCat = categoryRepository.findByName("Cloud Computing")
                                                .orElseThrow(() -> new RuntimeException(
                                                                "Cloud Computing category not found"));
                                Category designCat = categoryRepository.findByName("Design")
                                                .orElseThrow(() -> new RuntimeException("Design category not found"));
                                Category devOpsCat = categoryRepository.findByName("DevOps")
                                                .orElseThrow(() -> new RuntimeException("DevOps category not found"));
                                Category aiMlCat = categoryRepository.findByName("AI/ML")
                                                .orElseThrow(() -> new RuntimeException("AI/ML category not found"));
                                Category securityCat = categoryRepository.findByName("Security")
                                                .orElseThrow(() -> new RuntimeException("Security category not found"));

                                // Create all 11 courses with lessons
                                createJavaFullStackCourse(instructor, fullStackCat);
                                createGitGithubCourse(instructor, devToolsCat);
                                createMernStackCourse(instructor, fullStackCat);
                                createPythonDataScienceCourse(instructor, dataScienceCat);
                                createReactNativeCourse(instructor, mobileDevCat);
                                createAWSCourse(instructor, cloudCat);
                                createUIUXCourse(instructor, designCat);
                                createDevOpsCourse(instructor, devOpsCat);
                                createMachineLearningCourse(instructor, aiMlCat);
                                createFlutterCourse(instructor, mobileDevCat);
                                createCyberSecurityCourse(instructor, securityCat);

                                System.out.println("✅ All 11 courses created with lessons");

                        } else {
                                System.out.println("ℹ️ Courses already exist in database");
                        }
                } catch (Exception e) {
                        System.err.println("❌ Error creating courses: " + e.getMessage());
                        throw e;
                }
        }

        private void createJavaFullStackCourse(User instructor, Category category) {
                Course course = Course.builder()
                                .title("Java Full Stack Development")
                                .description(
                                                "Master Java, Spring Boot, React, and MongoDB to become a full-stack developer. Build real-world projects and learn industry best practices.")
                                .coverImageUrl("https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop")
                                .instructor(instructor)
                                .category(category)
                                .approved(true)
                                .price(0.0)
                                .level("Advanced")
                                .rating(4.8)
                                .totalStudents(3247)
                                .duration("12 weeks")
                                .build();
                Course savedCourse = courseRepository.save(course);

                List<Lesson> lessons = Arrays.asList(
                                createLesson("Introduction to Full Stack",
                                                "Overview of full stack development and course structure",
                                                "https://www.youtube.com/watch?v=eIrMbAQSU34", 1800, 1, savedCourse),
                                createLesson("Java Fundamentals", "Core Java concepts, OOP, and data structures",
                                                "https://www.youtube.com/watch?v=eIrMbAQSU34", 2400,
                                                2, savedCourse),
                                createLesson("Spring Boot Basics", "Building REST APIs with Spring Boot",
                                                "https://www.youtube.com/watch?v=eIrMbAQSU34", 2100, 3,
                                                savedCourse),
                                createLesson("Database Design with MongoDB", "NoSQL database design and integration",
                                                "https://www.youtube.com/watch?v=eIrMbAQSU34", 2700, 4,
                                                savedCourse),
                                createLesson("React Fundamentals", "React components, state, and props",
                                                "https://www.youtube.com/watch?v=eIrMbAQSU34", 2200, 5,
                                                savedCourse),
                                createLesson("Spring Security", "Authentication and authorization in Spring",
                                                "https://www.youtube.com/watch?v=eIrMbAQSU34", 2600, 6,
                                                savedCourse),
                                createLesson("Advanced React Patterns", "Hooks, context API, and state management",
                                                "https://www.youtube.com/watch?v=eIrMbAQSU34", 2300, 7,
                                                savedCourse),
                                createLesson("Microservices Architecture", "Building microservices with Spring Cloud",
                                                "https://www.youtube.com/watch?v=eIrMbAQSU34", 2900, 8,
                                                savedCourse),
                                createLesson("Project Setup", "Setting up the final project structure",
                                                "https://www.youtube.com/watch?v=eIrMbAQSU34", 1900, 9,
                                                savedCourse),
                                createLesson("Deployment Strategies", "Deploying full stack applications",
                                                "https://www.youtube.com/watch?v=eIrMbAQSU34", 2500, 10,
                                                savedCourse));
                lessonRepository.saveAll(lessons);
        }

        private void createGitGithubCourse(User instructor, Category category) {
                Course course = Course.builder()
                                .title("Git & GitHub Masterclass")
                                .description(
                                                "Complete guide to version control with Git and collaboration with GitHub. Learn branching, merging, pull requests and open source contributions.")
                                .coverImageUrl("https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400&h=250&fit=crop")
                                .instructor(instructor)
                                .category(category)
                                .approved(true)
                                .price(0.0)
                                .level("Beginner")
                                .rating(4.9)
                                .totalStudents(1895)
                                .duration("6 weeks")
                                .build();
                Course savedCourse = courseRepository.save(course);

                List<Lesson> lessons = Arrays.asList(
                                createLesson("Version Control Introduction", "What is version control and why use Git",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 1600, 1,
                                                savedCourse),
                                createLesson("Git Installation & Setup", "Installing Git and basic configuration",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 1400,
                                                2,
                                                savedCourse),
                                createLesson("Basic Git Commands", "add, commit, push, pull commands",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 1800, 3,
                                                savedCourse),
                                createLesson("Branching Strategies", "Creating, merging, and managing branches",
                                                "https://www.youtube.com/watch?v=e2GbPGeC17A", 2000,
                                                4, savedCourse),
                                createLesson("GitHub Collaboration", "Working with remote repositories",
                                                "https://www.youtube.com/watch?v=e2GbPGeC17A", 1900, 5,
                                                savedCourse),
                                createLesson("Pull Requests & Code Review", "Creating PRs and review process",
                                                "https://www.youtube.com/watch?v=e2GbPGeC17A", 1700, 6,
                                                savedCourse),
                                createLesson("Git Workflows", "Different Git workflows for teams",
                                                "https://www.youtube.com/watch?v=e2GbPGeC17A", 2100, 7,
                                                savedCourse),
                                createLesson("Advanced Git Features", "Rebase, stash, and cherry-pick",
                                                "https://www.youtube.com/watch?v=e2GbPGeC17A", 2200, 8,
                                                savedCourse),
                                createLesson("GitHub Actions CI/CD", "Automating workflows with GitHub Actions",
                                                "https://www.youtube.com/watch?v=e2GbPGeC17A", 2400,
                                                9, savedCourse));
                lessonRepository.saveAll(lessons);
        }

        private void createMernStackCourse(User instructor, Category category) {
                Course course = Course.builder()
                                .title("MERN Stack Development")
                                .description(
                                                "Build modern web applications with MongoDB, Express.js, React, and Node.js. Full-stack development with latest technologies.")
                                .coverImageUrl("https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop")
                                .instructor(instructor)
                                .category(category)
                                .approved(true)
                                .price(0.0)
                                .level("Intermediate")
                                .rating(4.7)
                                .totalStudents(2876)
                                .duration("14 weeks")
                                .build();
                Course savedCourse = courseRepository.save(course);

                List<Lesson> lessons = Arrays.asList(
                                createLesson("MERN Stack Overview", "Introduction to MERN stack technologies",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 1700, 1,
                                                savedCourse),
                                createLesson("Node.js & Express Setup", "Setting up backend server",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 2100, 2,
                                                savedCourse),
                                createLesson("MongoDB Database Design", "NoSQL database design principles",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 2300, 3,
                                                savedCourse),
                                createLesson("REST API Development", "Building RESTful APIs with Express",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 2500, 4,
                                                savedCourse),
                                createLesson("React Frontend Setup", "Creating React application structure",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 1900, 5,
                                                savedCourse),
                                createLesson("State Management", "Managing state with Context API and Redux",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 2700, 6,
                                                savedCourse),
                                createLesson("Authentication System", "JWT authentication implementation",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 2600, 7,
                                                savedCourse),
                                createLesson("Real-time Features", "WebSocket integration for real-time apps",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 2400, 8,
                                                savedCourse),
                                createLesson("Deployment", "Deploying MERN applications",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 2200, 9, savedCourse),
                                createLesson("Performance Optimization", "Optimizing MERN stack applications",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 2800, 10,
                                                savedCourse));
                lessonRepository.saveAll(lessons);
        }

        // Similarly create methods for other courses...
        private void createPythonDataScienceCourse(User instructor, Category category) {
                Course course = Course.builder()
                                .title("Python Data Science")
                                .description(
                                                "Learn data analysis, machine learning, and visualization with Python. Pandas, NumPy, Matplotlib, and Scikit-learn.")
                                .coverImageUrl("https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=400&h=250&fit=crop")
                                .instructor(instructor)
                                .category(category)
                                .approved(true)
                                .price(0.0)
                                .level("Intermediate")
                                .rating(4.6)
                                .totalStudents(2156)
                                .duration("10 weeks")
                                .build();
                Course savedCourse = courseRepository.save(course);

                List<Lesson> lessons = Arrays.asList(
                                createLesson("Python for Data Science", "Python basics for data analysis",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 1800, 1,
                                                savedCourse),
                                createLesson("NumPy Fundamentals", "Numerical computing with NumPy",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 2000, 2,
                                                savedCourse),
                                createLesson("Pandas Data Analysis", "Data manipulation with Pandas",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 2200, 3,
                                                savedCourse),
                                createLesson("Data Visualization", "Creating plots with Matplotlib and Seaborn",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 2100,
                                                4, savedCourse),
                                createLesson("Statistical Analysis", "Statistical methods for data science",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 2400, 5,
                                                savedCourse),
                                createLesson("Machine Learning Intro", "Introduction to ML algorithms",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 2600, 6,
                                                savedCourse),
                                createLesson("Scikit-learn", "Building ML models with scikit-learn",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 2500, 7,
                                                savedCourse),
                                createLesson("Data Preprocessing", "Cleaning and preparing data",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 2300, 8, savedCourse),
                                createLesson("Project: Data Analysis", "Complete data analysis project",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 2800, 9,
                                                savedCourse));
                lessonRepository.saveAll(lessons);
        }

        private void createReactNativeCourse(User instructor, Category category) {
                Course course = Course.builder()
                                .title("React Native Mobile Development")
                                .description(
                                                "Build cross-platform mobile apps for iOS and Android using React Native. Learn state management, navigation, and deployment.")
                                .coverImageUrl("https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop")
                                .instructor(instructor)
                                .category(category)
                                .approved(true)
                                .price(0.0)
                                .level("Intermediate")
                                .rating(4.5)
                                .totalStudents(1789)
                                .duration("8 weeks")
                                .build();
                Course savedCourse = courseRepository.save(course);

                List<Lesson> lessons = Arrays.asList(
                                createLesson("React Native Introduction", "What is React Native and setup",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 1600, 1,
                                                savedCourse),
                                createLesson("Components and Styling", "Building UI components",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 1900, 2, savedCourse),
                                createLesson("Navigation", "Implementing navigation in mobile apps",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 2100, 3,
                                                savedCourse),
                                createLesson("State Management", "Managing app state",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 2000, 4, savedCourse),
                                createLesson("API Integration", "Connecting to backend APIs",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 2300, 5, savedCourse),
                                createLesson("Native Features", "Accessing device features",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 2400, 6, savedCourse),
                                createLesson("App Deployment", "Publishing to app stores",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 2200, 7, savedCourse),
                                createLesson("Performance Optimization", "Optimizing React Native apps",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 2500, 8,
                                                savedCourse));
                lessonRepository.saveAll(lessons);
        }

        // Continue with other course creation methods...
        // createAWSCourse, createUIUXCourse, createDevOpsCourse,
        // createMachineLearningCourse, createFlutterCourse, createCyberSecurityCourse

        private void createAWSCourse(User instructor, Category category) {
                Course course = Course.builder()
                                .title("AWS Cloud Practitioner")
                                .description(
                                                "Master AWS fundamentals and prepare for certification. EC2, S3, RDS, Lambda, and more with hands-on labs.")
                                .coverImageUrl("https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop")
                                .instructor(instructor)
                                .category(category)
                                .approved(true)
                                .price(0.0)
                                .level("Beginner")
                                .rating(4.8)
                                .totalStudents(3421)
                                .duration("8 weeks")
                                .build();
                Course savedCourse = courseRepository.save(course);
                List<Lesson> lessons = Arrays.asList(
                                createLesson("AWS Cloud Concepts", "Introduction to AWS Cloud",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 1600, 1, savedCourse),
                                createLesson("EC2 Fundamentals", "Virtual servers in the cloud",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 2200, 2, savedCourse),
                                createLesson("S3 Storage", "Scalable storage in the cloud",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 1900, 3, savedCourse),
                                createLesson("RDS Database", "Managed relational databases",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 2400, 4, savedCourse),
                                createLesson("Lambda Functions", "Serverless compute",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 1800, 5, savedCourse));
                lessonRepository.saveAll(lessons);
        }

        private void createUIUXCourse(User instructor, Category category) {
                Course course = Course.builder()
                                .title("UI/UX Design Fundamentals")
                                .description(
                                                "Learn user-centered design principles, wireframing, prototyping, and design tools like Figma and Adobe XD.")
                                .coverImageUrl("https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop")
                                .instructor(instructor)
                                .category(category)
                                .approved(true)
                                .price(0.0)
                                .level("Beginner")
                                .rating(4.4)
                                .totalStudents(1567)
                                .duration("6 weeks")
                                .build();
                Course savedCourse = courseRepository.save(course);

                List<Lesson> lessons = Arrays.asList(
                                createLesson("Introduction to UI/UX", "Difference between UI and UX",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 1500, 1, savedCourse),
                                createLesson("Wireframing Basics", "Creating low-fidelity wireframes",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 2100, 2, savedCourse),
                                createLesson("Prototyping with Figma", "Interactive prototypes",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 2500, 3, savedCourse));
                lessonRepository.saveAll(lessons);
        }

        private void createDevOpsCourse(User instructor, Category category) {
                Course course = Course.builder()
                                .title("DevOps with Docker & Kubernetes")
                                .description(
                                                "Containerization with Docker, orchestration with Kubernetes, CI/CD pipelines, and infrastructure as code.")
                                .coverImageUrl("https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop")
                                .instructor(instructor)
                                .category(category)
                                .approved(true)
                                .price(0.0)
                                .level("Advanced")
                                .rating(4.7)
                                .totalStudents(1987)
                                .duration("10 weeks")
                                .build();
                Course savedCourse = courseRepository.save(course);

                List<Lesson> lessons = Arrays.asList(
                                createLesson("DevOps Introduction", "Culture and tools",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 1600, 1, savedCourse),
                                createLesson("Docker Basics", "Containers vs Virtual Machines",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 2300, 2, savedCourse),
                                createLesson("Kubernetes Overview", "Container orchestration",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 2600, 3, savedCourse),
                                createLesson("CI/CD Pipelines", "Automating build and deploy",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 2400, 4, savedCourse),
                                createLesson("Infrastructure as Code", "Terraform basics",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 2200, 5, savedCourse));
                lessonRepository.saveAll(lessons);
        }

        private void createMachineLearningCourse(User instructor, Category category) {
                Course course = Course.builder()
                                .title("Machine Learning with Python")
                                .description(
                                                "Comprehensive machine learning course covering algorithms, neural networks, deep learning, and real-world applications.")
                                .coverImageUrl("https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop")
                                .instructor(instructor)
                                .category(category)
                                .approved(true)
                                .price(0.0)
                                .level("Advanced")
                                .rating(4.9)
                                .totalStudents(2678)
                                .duration("12 weeks")
                                .build();
                Course savedCourse = courseRepository.save(course);

                List<Lesson> lessons = Arrays.asList(
                                createLesson("ML Overview", "Types of Machine Learning",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 1800, 1, savedCourse),
                                createLesson("Linear Regression", "Predicting values",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 2200, 2, savedCourse),
                                createLesson("Classification", "Categorizing data",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 2400, 3, savedCourse),
                                createLesson("Neural Networks", "Introduction to Deep Learning",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 2800, 4, savedCourse),
                                createLesson("Model Evaluation", "Accuracy and metrics",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 2000, 5, savedCourse));
                lessonRepository.saveAll(lessons);
        }

        private void createFlutterCourse(User instructor, Category category) {
                Course course = Course.builder()
                                .title("Flutter App Development")
                                .description(
                                                "Build beautiful native apps for iOS and Android with single codebase using Flutter and Dart programming.")
                                .coverImageUrl("https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=250&fit=crop")
                                .instructor(instructor)
                                .category(category)
                                .approved(true)
                                .price(0.0)
                                .level("Intermediate")
                                .rating(4.6)
                                .totalStudents(1890)
                                .duration("9 weeks")
                                .build();
                Course savedCourse = courseRepository.save(course);

                List<Lesson> lessons = Arrays.asList(
                                createLesson("Flutter Intro", "Widgets and composition",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 1600, 1, savedCourse),
                                createLesson("Dart Programming", "Language basics",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 2000, 2, savedCourse),
                                createLesson("Stateful Widgets", "Managing interactivity",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 2200, 3, savedCourse),
                                createLesson("Flutter Navigation", "Routing and screens",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 1900, 4, savedCourse),
                                createLesson("API Calls", "Networking in Flutter",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 2300, 5, savedCourse));
                lessonRepository.saveAll(lessons);
        }

        private void createCyberSecurityCourse(User instructor, Category category) {
                Course course = Course.builder()
                                .title("Cyber Security Fundamentals")
                                .description(
                                                "Learn ethical hacking, network security, cryptography, and security best practices to protect digital assets.")
                                .coverImageUrl("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop")
                                .instructor(instructor)
                                .category(category)
                                .approved(true)
                                .price(0.0)
                                .level("Intermediate")
                                .rating(4.8)
                                .totalStudents(2345)
                                .duration("10 weeks")
                                .build();
                Course savedCourse = courseRepository.save(course);

                List<Lesson> lessons = Arrays.asList(
                                createLesson("Security Basics", "CIA Triad",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 1500, 1, savedCourse),
                                createLesson("Network Security", "Firewalls and VPNs",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 2100, 2, savedCourse),
                                createLesson("Ethical Hacking", "Penetration testing methodology",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 2500, 3, savedCourse),
                                createLesson("Cryptography", "Encryption and hashing",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 2300, 4, savedCourse),
                                createLesson("Web Security", "OWASP Top 10",
                                                "https://www.youtube.com/watch?v=GetjIB82k9k", 2000, 5, savedCourse));
                lessonRepository.saveAll(lessons);
        }

        private void createSampleQuizzes() {
                try {
                        if (quizRepository.count() == 0) {
                                // Find the first lesson of the Java course to attach a quiz
                                Optional<Course> javaCourse = courseRepository
                                                .findByTitle("Java Full Stack Development");
                                if (javaCourse.isPresent()) {
                                        List<Lesson> lessons = lessonRepository
                                                        .findByCourseOrderByPositionAsc(javaCourse.get());
                                        if (!lessons.isEmpty()) {
                                                Lesson firstLesson = lessons.get(0);

                                                Quiz quiz = Quiz.builder()
                                                                .lesson(firstLesson)
                                                                .passingScore(60)
                                                                .build();

                                                Quiz savedQuiz = quizRepository.save(quiz);

                                                List<Question> questions = Arrays.asList(
                                                                Question.builder()
                                                                                .quiz(savedQuiz)
                                                                                .text("What does JVM stand for?")
                                                                                .options(Arrays.asList(
                                                                                                "Java Virtual Machine",
                                                                                                "Java Very Much",
                                                                                                "Just Virtual Machine",
                                                                                                "Java Visual Monitor"))
                                                                                .correctOptionIndex(0)
                                                                                .build(),
                                                                Question.builder()
                                                                                .quiz(savedQuiz)
                                                                                .text("Which keyword is used to create a subclass in Java?")
                                                                                .options(Arrays.asList("extends",
                                                                                                "implements",
                                                                                                "inherits", "subclass"))
                                                                                .correctOptionIndex(0)
                                                                                .build(),
                                                                Question.builder()
                                                                                .quiz(savedQuiz)
                                                                                .text("What is the parent class of all classes in Java?")
                                                                                .options(Arrays.asList("Object", "Main",
                                                                                                "Super", "Root"))
                                                                                .correctOptionIndex(0)
                                                                                .build());

                                                questionRepository.saveAll(questions);
                                                System.out.println(
                                                                "✅ Sample quiz created for: " + firstLesson.getTitle());
                                        }
                                }
                        }
                } catch (Exception e) {
                        System.err.println("❌ Error creating sample quizzes: " + e.getMessage());
                }
        }

        private Lesson createLesson(String title, String content, String mediaUrl, Integer duration, Integer position,
                        Course course) {
                return Lesson.builder()
                                .title(title)
                                .content(content)
                                .mediaUrl(mediaUrl)
                                .durationSeconds(duration)
                                .position(position)
                                .course(course)
                                .build();
        }

        private void createSampleEnrollments() {
                try {
                        if (enrollmentRepository.count() == 0) {
                                // Get all students
                                List<User> students = userRepository.findByRoleName(Role.RoleName.ROLE_STUDENT);
                                List<Course> courses = courseRepository.findAll();

                                if (students.isEmpty() || courses.isEmpty()) {
                                        System.out.println("ℹ️ No students or courses found for enrollments");
                                        return;
                                }

                                int enrollmentsCreated = 0;

                                // Create enrollments for each student in multiple courses
                                for (User student : students) {
                                        for (int i = 0; i < 3 && i < courses.size(); i++) {
                                                Course course = courses.get(i);
                                                Enrollment enrollment = Enrollment.builder()
                                                                .student(student)
                                                                .course(course)
                                                                .progress(0.0)
                                                                .build();
                                                enrollmentRepository.save(enrollment);
                                                enrollmentsCreated++;
                                        }
                                }

                                System.out.println("✅ " + enrollmentsCreated + " sample enrollments created");

                        } else {
                                System.out.println("ℹ️ Enrollments already exist in database");
                        }
                } catch (Exception e) {
                        System.err.println("❌ Error creating enrollments: " + e.getMessage());
                }
        }

        private void updateMissingAuditFields() {
                try {
                        List<User> users = userRepository.findAll();
                        boolean updated = false;
                        for (User user : users) {
                                if (user.getCreatedAt() == null) {
                                        user.setCreatedAt(java.time.LocalDateTime.now()
                                                        .minusDays(new java.util.Random().nextInt(30)));
                                        userRepository.save(user);
                                        updated = true;
                                }
                        }
                        if (updated) {
                                System.out.println("✅ Updated missing createdAt for existing users");
                        }

                        List<Course> courses = courseRepository.findAll();
                        updated = false;
                        for (Course course : courses) {
                                if (course.getCreatedAt() == null) {
                                        course.setCreatedAt(java.time.LocalDateTime.now()
                                                        .minusDays(new java.util.Random().nextInt(30)));
                                        courseRepository.save(course);
                                        updated = true;
                                }
                        }
                        if (updated) {
                                System.out.println("✅ Updated missing createdAt for existing courses");
                        }
                } catch (Exception e) {
                        System.err.println("❌ Error updating audit fields: " + e.getMessage());
                }
        }
}
