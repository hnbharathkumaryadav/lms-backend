package com.lms.backend.controller;

import com.lms.backend.model.User;
import com.lms.backend.service.AuthService;
import com.lms.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthService authService;

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile() {
        User currentUser = authService.getCurrentUser();
        // Return a clean user object (don't send password)
        currentUser.setPassword(null);
        return ResponseEntity.ok(currentUser);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody User profileData) {
        try {
            User currentUser = authService.getCurrentUser();
            User updatedUser = userService.updateProfile(currentUser.getId(), profileData);
            updatedUser.setPassword(null);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
