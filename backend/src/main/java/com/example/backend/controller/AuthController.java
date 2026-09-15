package com.example.backend.controller;

import com.example.backend.model.AppUser;
import com.example.backend.repository.AppUserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*") // For demo purposes
public class AuthController {

    private final AppUserRepository userRepository;

    public AuthController(AppUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        if (username == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username and password required"));
        }

        Optional<AppUser> userOpt = userRepository.findByUsername(username);
        
        AppUser user;
        if (userOpt.isEmpty()) {
            // Auto-register for hackathon demo purposes if user doesn't exist
            user = new AppUser();
            user.setUsername(username);
            user.setPassword(password); // In production, hash this!
            
            // Assign roles based on username prefix for demo
            if (username.startsWith("rec")) user.setRole("RECYCLER");
            else if (username.startsWith("make")) user.setRole("MAKER");
            else user.setRole("COLLECTOR");
            
            user = userRepository.save(user);
        } else {
            user = userOpt.get();
            if (!user.getPassword().equals(password)) {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
            }
        }

        // Generate a mock JWT/Session token
        String token = UUID.randomUUID().toString() + "-" + user.getRole();
        
        return ResponseEntity.ok(Map.of(
            "token", token,
            "role", user.getRole(),
            "userId", user.getId().toString(),
            "username", user.getUsername()
        ));
    }
}
