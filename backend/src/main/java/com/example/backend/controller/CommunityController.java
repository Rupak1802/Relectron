package com.example.backend.controller;

import com.example.backend.model.CommunityPost;
import com.example.backend.repository.CommunityPostRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/community")
@CrossOrigin(origins = "*") // For demo
public class CommunityController {

    private final CommunityPostRepository communityPostRepository;

    public CommunityController(CommunityPostRepository communityPostRepository) {
        this.communityPostRepository = communityPostRepository;
    }

    @GetMapping
    public List<CommunityPost> getAllPosts() {
        return communityPostRepository.findAll();
    }

    @PostMapping
    public CommunityPost createPost(@RequestBody CommunityPost post) {
        if (post.getTimestamp() == null) {
            post.setTimestamp(LocalDateTime.now());
        }
        if (post.getLikes() == null) {
            post.setLikes(0);
        }
        return communityPostRepository.save(post);
    }
}
