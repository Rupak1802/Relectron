package com.example.backend.repository;

import com.example.backend.model.RecyclerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RecyclerProfileRepository extends JpaRepository<RecyclerProfile, Long> {
    Optional<RecyclerProfile> findByUserId(Long userId);
}
