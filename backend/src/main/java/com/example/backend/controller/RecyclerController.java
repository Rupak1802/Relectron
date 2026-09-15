package com.example.backend.controller;

import com.example.backend.model.RecyclerProfile;
import com.example.backend.repository.RecyclerProfileRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/recyclers")
@CrossOrigin(origins = "*") // For demo
public class RecyclerController {

    private final RecyclerProfileRepository recyclerProfileRepository;

    public RecyclerController(RecyclerProfileRepository recyclerProfileRepository) {
        this.recyclerProfileRepository = recyclerProfileRepository;
    }

    @GetMapping
    public List<RecyclerProfile> getAllRecyclers() {
        return recyclerProfileRepository.findAll();
    }

    @PostMapping
    public RecyclerProfile createRecycler(@RequestBody RecyclerProfile profile) {
        return recyclerProfileRepository.save(profile);
    }
}
