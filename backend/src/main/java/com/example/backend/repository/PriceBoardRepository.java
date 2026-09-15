package com.example.backend.repository;

import com.example.backend.model.PriceBoard;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PriceBoardRepository extends JpaRepository<PriceBoard, Long> {
    Optional<PriceBoard> findByMaterial(String material);
}
