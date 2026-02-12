package com.lms.backend.service.impl;

import com.lms.backend.model.User;
import com.lms.backend.repository.UserRepository;
import com.lms.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public User updateProfile(Long id, User profileData) {
        User user = getUserById(id);
        if (profileData.getUsername() != null)
            user.setUsername(profileData.getUsername());
        if (profileData.getEmail() != null)
            user.setEmail(profileData.getEmail());
        // Add more fields if necessary
        return userRepository.save(user);
    }

    @Override
    public void deleteUser(Long id) {
        User existing = getUserById(id);
        userRepository.delete(existing);
    }
}