package com.lms.backend.service;

import java.util.List;
import java.util.Map;

public interface ActivityService {
    void logActivity(String type, String message, String icon);

    List<Map<String, Object>> getRecentActivities();
}
