package com.example.backend.controller;

import com.example.backend.service.AiChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    private final AiChatService aiChatService;

    public ChatController(AiChatService aiChatService) {
        this.aiChatService = aiChatService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> processChat(@RequestBody Map<String, String> payload) {
        String message = payload.get("message");
        if (message == null || message.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("response", "Message cannot be empty"));
        }

        String aiResponse = aiChatService.chat(message);
        return ResponseEntity.ok(Map.of("response", aiResponse));
    }
}
