package com.example.backend.repository;

import com.example.backend.model.MarketplaceItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MarketplaceItemRepository extends JpaRepository<MarketplaceItem, Long> {
}
