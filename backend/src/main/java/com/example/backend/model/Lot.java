package com.example.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDateTime;

@Entity
public class Lot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String lotId;
    private String collectorId;
    private String material;
    private Double weight;
    private LocalDateTime timestamp;
    private String status; // PENDING_PICKUP, VERIFIED, COMPLETED
    private Double gpsLat;
    private Double gpsLng;
    private String qrHashPayload;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getLotId() { return lotId; }
    public void setLotId(String lotId) { this.lotId = lotId; }
    public String getCollectorId() { return collectorId; }
    public void setCollectorId(String collectorId) { this.collectorId = collectorId; }
    public String getMaterial() { return material; }
    public void setMaterial(String material) { this.material = material; }
    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Double getGpsLat() { return gpsLat; }
    public void setGpsLat(Double gpsLat) { this.gpsLat = gpsLat; }
    public Double getGpsLng() { return gpsLng; }
    public void setGpsLng(Double gpsLng) { this.gpsLng = gpsLng; }
    public String getQrHashPayload() { return qrHashPayload; }
    public void setQrHashPayload(String qrHashPayload) { this.qrHashPayload = qrHashPayload; }
}
