package com.example.backend.controller;

import com.example.backend.model.Lot;
import com.example.backend.repository.LotRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/lots")
@CrossOrigin(origins = "*") // For demo purposes
public class HandoverController {

    private final LotRepository lotRepository;

    public HandoverController(LotRepository lotRepository) {
        this.lotRepository = lotRepository;
    }

    @PostMapping
    public ResponseEntity<Lot> createLot(@RequestBody Lot lot) {
        if (lot.getLotId() == null) {
            lot.setLotId("LOT-" + LocalDateTime.now().getYear() + "-MH-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase());
        }
        lot.setTimestamp(LocalDateTime.now());
        lot.setStatus("PENDING_PICKUP");
        
        Lot savedLot = lotRepository.save(lot);
        return ResponseEntity.ok(savedLot);
    }

    @GetMapping("/{lotId}")
    public ResponseEntity<Lot> getLot(@PathVariable String lotId) {
        return lotRepository.findByLotId(lotId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{lotId}/verify")
    public ResponseEntity<Lot> verifyHandover(@PathVariable String lotId, @RequestBody Map<String, String> verificationPayload) {
        return lotRepository.findByLotId(lotId).map(lot -> {
            // In a real scenario, validate QR hash signature here
            lot.setStatus("VERIFIED");
            return ResponseEntity.ok(lotRepository.save(lot));
        }).orElse(ResponseEntity.notFound().build());
    }
}
