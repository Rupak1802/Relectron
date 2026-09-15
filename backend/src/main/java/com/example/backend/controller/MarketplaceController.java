package com.example.backend.controller;

import com.example.backend.model.MarketplaceItem;
import com.example.backend.repository.MarketplaceItemRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/marketplace")
@CrossOrigin(origins = "*") // For demo
public class MarketplaceController {

    private final MarketplaceItemRepository marketplaceItemRepository;

    public MarketplaceController(MarketplaceItemRepository marketplaceItemRepository) {
        this.marketplaceItemRepository = marketplaceItemRepository;
    }

    @GetMapping
    public List<MarketplaceItem> getAllItems() {
        return marketplaceItemRepository.findAll();
    }

    @PostMapping
    public MarketplaceItem createItem(@RequestBody MarketplaceItem item) {
        return marketplaceItemRepository.save(item);
    }
}
