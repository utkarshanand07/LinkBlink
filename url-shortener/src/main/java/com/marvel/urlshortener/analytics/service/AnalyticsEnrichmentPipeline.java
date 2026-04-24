package com.marvel.urlshortener.analytics.service;

import com.marvel.urlshortener.analytics.dto.RawClickPayload;
import com.marvel.urlshortener.analytics.port.AdvancedAnalyticsRepository;
import com.marvel.urlshortener.models.ClickEvent;
import com.marvel.urlshortener.models.UrlMapping;
import com.marvel.urlshortener.repository.UrlMappingRepository;
import com.marvel.urlshortener.service.DeviceMetadataService;
import com.marvel.urlshortener.service.GeoLocationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
@ConditionalOnProperty(name = "analytics.enabled", havingValue = "true")
public class AnalyticsEnrichmentPipeline {
    private final GeoLocationService geoService;
    private final DeviceMetadataService deviceService;
    private final AdvancedAnalyticsRepository analyticsRepository;
    private final UrlMappingRepository urlMappingRepository;

    // This listens for the payload published by AsyncEventPublisher
    @Async
    @EventListener
    public void processRawEvent(RawClickPayload payload) {
        try {
            log.debug("Enriching payload for URL: {}", payload.getShortUrl());

            // 1. Find the URL relation
            UrlMapping urlMapping = urlMappingRepository.findByShortUrl(payload.getShortUrl());

            if (urlMapping == null) {
                log.warn("URL mapping not found for shortUrl: {}", payload.getShortUrl());
                return;
            }

            // 2. Hydrate Geo Data
            GeoLocationService.LocationData loc = geoService.getLocation(payload.getIpAddress());

            // 3. Build the Entity using the builder pattern
            ClickEvent enrichedEvent = ClickEvent.builder()
                    .urlMapping(urlMapping)
                    .clickDate(payload.getTimestamp())
                    .ip(maskIp(payload.getIpAddress()))
                    .country(loc.country())
                    .city(loc.city())
                    .browser(deviceService.extractBrowser(payload.getUserAgent()))
                    .os(deviceService.extractOs(payload.getUserAgent()))
                    .deviceType(deviceService.extractDeviceType(payload.getUserAgent()))
                    .referrer(payload.getReferrer() != null ? payload.getReferrer() : "Direct")
                    .build();

            // 4. Save to whatever DB is configured in application.properties
            analyticsRepository.saveAnalytics(enrichedEvent);

        } catch (Exception e) {
            log.error("Failed to process analytics event", e);
        }
    }

    // Helper method to mask IPs (e.g., 192.168.1.50 -> ***.***.***.50)
    private String maskIp(String ipAddress) {
        if (ipAddress == null || !ipAddress.contains(".")) return "Unknown";
        return "***.***.***." + ipAddress.substring(ipAddress.lastIndexOf('.') + 1);
    }
}
