package com.lms.backend.service.impl;

import com.lms.backend.model.SystemActivity;
import com.lms.backend.repository.SystemActivityRepository;
import com.lms.backend.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ActivityServiceImpl implements ActivityService {

    @Autowired
    private SystemActivityRepository systemActivityRepository;

    @Override
    public void logActivity(String type, String message, String icon) {
        SystemActivity activity = SystemActivity.builder()
                .type(type)
                .message(message)
                .icon(icon)
                .createdAt(LocalDateTime.now())
                .build();
        systemActivityRepository.save(activity);
    }

    @Override
    public List<Map<String, Object>> getRecentActivities() {
        return systemActivityRepository.findTop10ByOrderByCreatedAtDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private Map<String, Object> mapToResponse(SystemActivity activity) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", activity.getId());
        map.put("type", activity.getType());
        map.put("message", activity.getMessage());
        map.put("icon", activity.getIcon());
        map.put("time", formatTimeAgo(activity.getCreatedAt()));
        return map;
    }

    private String formatTimeAgo(LocalDateTime dateTime) {
        LocalDateTime now = LocalDateTime.now();
        long minutes = ChronoUnit.MINUTES.between(dateTime, now);
        long hours = ChronoUnit.HOURS.between(dateTime, now);
        long days = ChronoUnit.DAYS.between(dateTime, now);

        if (minutes < 1)
            return "Just now";
        if (minutes < 60)
            return minutes + " minutes ago";
        if (hours < 24)
            return hours + " hours ago";
        if (days == 1)
            return "Yesterday";
        if (days < 7)
            return days + " days ago";
        return dateTime.format(DateTimeFormatter.ofPattern("MMM dd, yyyy"));
    }
}
