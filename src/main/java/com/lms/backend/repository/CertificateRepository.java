package com.lms.backend.repository;

import com.lms.backend.model.Certificate;
import com.lms.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    List<Certificate> findByStudent(User student);

    Optional<Certificate> findByStudentAndCourse_Id(User student, Long courseId);

    List<Certificate> findByCourse(com.lms.backend.model.Course course);
}
