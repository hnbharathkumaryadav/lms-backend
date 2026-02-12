package com.lms.backend.repository;

import com.lms.backend.model.SystemActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SystemActivityRepository extends JpaRepository<SystemActivity, Long> {

    // Find top 10 activities ordered by createdAt desc
    List<SystemActivity> findTop10ByOrderByCreatedAtDesc();
}
