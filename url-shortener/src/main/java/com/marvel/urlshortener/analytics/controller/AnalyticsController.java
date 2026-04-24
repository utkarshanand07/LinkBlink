package com.marvel.urlshortener.analytics.controller;

import com.marvel.urlshortener.analytics.dto.AdvancedAnalyticsDTO;
import com.marvel.urlshortener.analytics.service.DashboardAnalyticsService;
import com.marvel.urlshortener.models.Tier;
import com.marvel.urlshortener.models.User;
import com.marvel.urlshortener.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/analytics/advanced")
@RequiredArgsConstructor
public class AnalyticsController {
    private final ObjectProvider<DashboardAnalyticsService> analyticsServiceProvider;
    private final UserService userService;

    @GetMapping("/url/{shortUrl}")
    public ResponseEntity<?> getUrlAnalytics(@PathVariable String shortUrl, Principal principal) {
        DashboardAnalyticsService service = analyticsServiceProvider.getIfAvailable();
        if (service == null) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body("Advanced Analytics are currently disabled.");
        }

        try {
            User currentUser = userService.findByUsername(principal.getName());

            // --- NEW: Security Check based on Tier Enum ---
            if (!hasAdvancedAccess(currentUser)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Upgrade to Enterprise to view Advanced Analytics.");
            }

            AdvancedAnalyticsDTO summary = service.getAdvancedAnalyticsForUrl(shortUrl, currentUser);
            return ResponseEntity.ok(summary);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    @GetMapping("/total")
    public ResponseEntity<?> getTotalUserAnalytics(Principal principal) {
        DashboardAnalyticsService service = analyticsServiceProvider.getIfAvailable();
        if (service == null) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body("Advanced Analytics are currently disabled.");
        }

        try {
            User currentUser = userService.findByUsername(principal.getName());

            // --- NEW: Security Check based on Tier Enum ---
            if (!hasAdvancedAccess(currentUser)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Upgrade to Enterprise to view Advanced Analytics.");
            }

            AdvancedAnalyticsDTO summary = service.getAdvancedAnalyticsForTotalUser(currentUser);
            return ResponseEntity.ok(summary);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to load analytics.");
        }
    }

    // --- Helper Method for Tier Verification ---
    private boolean hasAdvancedAccess(User user) {
        if (user == null || user.getRole() == null) return false;
        try {
            Tier userTier = Tier.valueOf(user.getRole());
            return userTier.hasAdvancedAnalytics();
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
}
