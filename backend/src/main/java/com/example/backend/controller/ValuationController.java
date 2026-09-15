package com.example.backend.controller;

import com.example.backend.service.AiVisionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/valuation")
@CrossOrigin(origins = "*") // For demo purposes
public class ValuationController {

    private final AiVisionService aiVisionService;

    public ValuationController(AiVisionService aiVisionService) {
        this.aiVisionService = aiVisionService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<String> analyzeScrap(@RequestBody Map<String, String> payload) {
        String base64Image = payload.get("image");
        if (base64Image == null || base64Image.isEmpty()) {
            return ResponseEntity.badRequest().body("{\"error\": \"Image is required\"}");
        }
        
        // Remove data URL prefix if present (e.g. data:image/jpeg;base64,)
        if (base64Image.contains(",")) {
            base64Image = base64Image.split(",")[1];
        }

        String jsonResult = aiVisionService.analyzeScrapMaterial(base64Image);
        return ResponseEntity.ok(jsonResult);
    }
}
