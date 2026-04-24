package com.marvel.urlshortener.controller;

import com.marvel.urlshortener.analytics.dto.RawClickPayload;
import com.marvel.urlshortener.analytics.port.AnalyticsEventPublisher;
import com.marvel.urlshortener.models.Tier;
import com.marvel.urlshortener.models.UrlMapping;
import com.marvel.urlshortener.service.UrlMappingService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@RestController
@RequiredArgsConstructor
public class RedirectController {
    private final UrlMappingService urlMappingService;
    private final Optional<AnalyticsEventPublisher> eventPublisher;

    @Value("${analytics.enabled:false}")
    private boolean analyticsEnabled;

    @GetMapping("/{shortUrl}")
    public ResponseEntity<?> redirect(@PathVariable String shortUrl, HttpServletRequest request) {

        UrlMapping urlMapping = urlMappingService.getOriginalUrl(shortUrl);

        if (urlMapping != null) {

            // 1. Dispatch Advanced Analytics
            // Check master switch -> Check publisher exists -> Check Tier permissions
            if (analyticsEnabled && eventPublisher.isPresent() && userHasAdvancedAnalytics(urlMapping)) {
                dispatchAnalyticsEvent(shortUrl, request);
            }

            // 2. Execute Redirect Instantly
            HttpHeaders httpHeaders = new HttpHeaders();
            httpHeaders.add("Location", urlMapping.getOriginalUrl());
            return ResponseEntity.status(HttpStatus.FOUND).headers(httpHeaders).build();

        } else {
            return ResponseEntity.status(HttpStatus.GONE)
                    .body("This URL has expired or does not exist.");
        }
    }

    private void dispatchAnalyticsEvent(String shortUrl, HttpServletRequest request) {
        try {
            String ip = extractIpAddress(request);
            String userAgent = request.getHeader("User-Agent");
            String referrer = request.getHeader("Referer");

            RawClickPayload payload = new RawClickPayload(
                    shortUrl, ip, userAgent, referrer, LocalDateTime.now()
            );

            eventPublisher.get().publish(payload);
        } catch (Exception e) {
            log.error("Failed to publish analytics event for shortUrl: {}", shortUrl, e);
        }
    }

    private String extractIpAddress(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        return ip;
    }

    // --- NEW: Clean, Enum-driven permission check ---
    private boolean userHasAdvancedAnalytics(UrlMapping urlMapping) {
        if (urlMapping.getUser() == null || urlMapping.getUser().getRole() == null) {
            return false; // Guests get no analytics
        }
        try {
            Tier userTier = Tier.valueOf(urlMapping.getUser().getRole());
            return userTier.hasAdvancedAnalytics();
        } catch (IllegalArgumentException e) {
            log.warn("Unknown role found: {}", urlMapping.getUser().getRole());
            return false;
        }
    }
}
