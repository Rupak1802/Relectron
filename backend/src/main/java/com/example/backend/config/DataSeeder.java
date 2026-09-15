package com.example.backend.config;

import com.example.backend.model.AppUser;
import com.example.backend.repository.AppUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final AppUserRepository userRepository;

    public DataSeeder(AppUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        seedUser("collector", "password", "COLLECTOR");
        seedUser("recycler", "password", "RECYCLER");
        seedUser("maker", "password", "MAKER");
    }

    private void seedUser(String username, String password, String role) {
        if (userRepository.findByUsername(username).isEmpty()) {
            AppUser user = new AppUser();
            user.setUsername(username);
            user.setPassword(password);
            user.setRole(role);
            userRepository.save(user);
            System.out.println("Seeded user: " + username + " with role " + role);
        }
    }
}
