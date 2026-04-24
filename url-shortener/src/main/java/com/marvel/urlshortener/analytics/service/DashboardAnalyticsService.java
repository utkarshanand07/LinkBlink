package com.marvel.urlshortener.analytics.service;

import com.marvel.urlshortener.analytics.dto.AdvancedAnalyticsDTO;
import com.marvel.urlshortener.models.UrlMapping;
import com.marvel.urlshortener.models.User;
import com.marvel.urlshortener.repository.ClickEventRepository;
import com.marvel.urlshortener.repository.UrlMappingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@ConditionalOnProperty(name = "analytics.enabled", havingValue = "true")
public class DashboardAnalyticsService {
    private final ClickEventRepository clickEventRepository;
    private final UrlMappingRepository urlMappingRepository;

    @Transactional(readOnly = true)
    public AdvancedAnalyticsDTO getAdvancedAnalyticsForUrl(String shortUrl, User requestingUser) {
        UrlMapping mapping = urlMappingRepository.findByShortUrl(shortUrl);
        if (mapping == null) throw new RuntimeException("URL not found");

        // Security: Ensure user owns this URL
        if (mapping.getUser() == null || !mapping.getUser().getId().equals(requestingUser.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        Long urlId = mapping.getId();
        return AdvancedAnalyticsDTO.builder()
                .clicksByCountry(clickEventRepository.getCountryStatsByUrl(urlId))
                .clicksByDevice(clickEventRepository.getDeviceStatsByUrl(urlId))
                .clicksByBrowser(clickEventRepository.getBrowserStatsByUrl(urlId))
                .clicksByOs(clickEventRepository.getOsStatsByUrl(urlId))
                .clicksByReferrer(clickEventRepository.getReferrerStatsByUrl(urlId))
                .build();
    }

    @Transactional(readOnly = true)
    public AdvancedAnalyticsDTO getAdvancedAnalyticsForTotalUser(User requestingUser) {
        Long userId = requestingUser.getId();
        return AdvancedAnalyticsDTO.builder()
                .clicksByCountry(clickEventRepository.getCountryStatsByUser(userId))
                .clicksByDevice(clickEventRepository.getDeviceStatsByUser(userId))
                .clicksByBrowser(clickEventRepository.getBrowserStatsByUser(userId))
                .clicksByOs(clickEventRepository.getOsStatsByUser(userId))
                .clicksByReferrer(clickEventRepository.getReferrerStatsByUser(userId))
                .build();
    }
}
