package com.marvel.urlshortener.controller;

import com.marvel.urlshortener.dtos.UrlMappingDTO;
import com.marvel.urlshortener.dtos.UserDTO;
import com.marvel.urlshortener.service.AdminService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@AllArgsConstructor
@PreAuthorize("hasRole('ADMIN')")

public class AdminController {
    private final AdminService adminService;

    // --- USERS ---

    @GetMapping("/users")
    public ResponseEntity<Page<UserDTO>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminService.getAllUsers(page, size));
    }

    @PutMapping("/users/{userId}/role")
    public ResponseEntity<Void> changeUserRole(@PathVariable Long userId, @RequestBody Map<String, String> request) {
        String newRole = request.get("role");
        adminService.changeUserRole(userId, newRole);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/users/bulk")
    public ResponseEntity<Void> deleteUsers(@RequestBody Map<String, List<Long>> request) {
        adminService.deleteUsers(request.get("ids"));
        return ResponseEntity.ok().build();
    }

    // --- LINKS ---

    @GetMapping("/links")
    public ResponseEntity<Page<UrlMappingDTO>> getAllLinks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminService.getAllLinks(page, size));
    }

    @GetMapping("/users/{userId}/links")
    public ResponseEntity<Page<UrlMappingDTO>> getLinksByUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminService.getLinksByUser(userId, page, size));
    }

    @GetMapping("/links/filter")
    public ResponseEntity<Page<UrlMappingDTO>> getLinksByDateRange(
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestParam(defaultValue = "created") String dateType, // "created" or "expiry"
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        LocalDateTime start = LocalDateTime.parse(startDate, formatter);
        LocalDateTime end = LocalDateTime.parse(endDate, formatter);

        return ResponseEntity.ok(adminService.getLinksByDateRange(start, end, dateType, page, size));
    }

    @DeleteMapping("/links/bulk")
    public ResponseEntity<Void> deleteLinks(@RequestBody Map<String, List<Long>> request) {
        adminService.deleteLinks(request.get("ids"));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/links/cleanup")
    public ResponseEntity<Map<String, Integer>> cleanupExpiredLinks() {
        int deletedCount = adminService.cleanupExpiredLinks();
        return ResponseEntity.ok(Map.of("deletedCount", deletedCount));
    }

    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Long>> getPlatformMetrics() {
        return ResponseEntity.ok(adminService.getPlatformMetrics());
    }

    // --- ANALYTICS ---

    @DeleteMapping("/links/{linkId}/clicks")
    public ResponseEntity<Void> clearClicksForLink(@PathVariable Long linkId) {
        adminService.clearClicksForLink(linkId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/users/{userId}/links")
    public ResponseEntity<Void> clearLinksForUser(@PathVariable Long userId) {
        adminService.clearLinksForUser(userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/users/{userId}/clicks")
    public ResponseEntity<Void> clearClicksForUser(@PathVariable Long userId) {
        adminService.clearClicksForUser(userId);
        return ResponseEntity.ok().build();
    }
}
