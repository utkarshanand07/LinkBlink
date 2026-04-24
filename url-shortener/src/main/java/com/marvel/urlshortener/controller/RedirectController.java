package com.marvel.urlshortener.controller;

import com.marvel.urlshortener.analytics.dto.RawClickPayload;
import com.marvel.urlshortener.analytics.port.AnalyticsEventPublisher;
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

import java.net.URI;
import java.time.LocalDateTime;

@Slf4j
@RestController
@RequiredArgsConstructor
public class RedirectController {
    private final UrlMappingService urlMappingService;

    // We use Optional in case the bean isn't loaded (if analytics.enabled=false)
    private final java.util.Optional<AnalyticsEventPublisher> eventPublisher;

    @Value("${analytics.enabled:false}")
    private boolean analyticsEnabled;

    @GetMapping("/{shortUrl}")
    public ResponseEntity<?> redirect(@PathVariable String shortUrl, HttpServletRequest request) {

        // 1. Get the original URL (This also handles the synchronous click count update!)
        UrlMapping urlMapping = urlMappingService.getOriginalUrl(shortUrl);

        if (urlMapping != null) {

            // 2. Dispatch Advanced Analytics (Only if enabled and user is premium)
            // Note: We check if eventPublisher is present. If analytics.enabled=false,
            // Spring won't create the Publisher bean, so we don't even try to send it.
            if (analyticsEnabled && eventPublisher.isPresent() && isPremiumUser(urlMapping)) {
                dispatchAnalyticsEvent(shortUrl, request);
            }

            // 3. Execute Redirect Instantly
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

    // Helper method to determine if the URL owner gets advanced analytics
    private boolean isPremiumUser(UrlMapping urlMapping) {
        if (urlMapping.getUser() == null) return false; // Guests get no analytics
        String role = urlMapping.getUser().getRole();
        // Adjust these role names based on your Tier enum
        return "ROLE_PRO".equals(role) || "ROLE_ENTERPRISE".equals(role) || "ROLE_ADMIN".equals(role);
    }
}
