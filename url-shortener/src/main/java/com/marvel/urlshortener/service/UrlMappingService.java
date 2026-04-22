package com.marvel.urlshortener.service;

import com.marvel.urlshortener.dtos.ClickEventDTO;
import com.marvel.urlshortener.dtos.UrlMappingDTO;
import com.marvel.urlshortener.models.ClickEvent;
import com.marvel.urlshortener.models.Tier;
import com.marvel.urlshortener.models.UrlMapping;
import com.marvel.urlshortener.models.User;
import com.marvel.urlshortener.repository.ClickEventRepository;
import com.marvel.urlshortener.repository.UrlMappingRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UrlMappingService {
    private UrlMappingRepository urlMappingRepository;
    private ClickEventRepository clickEventRepository;

    public UrlMappingDTO createShortUrl(String originalUrl, User user) {
        // 1. Determine Tier (Defaults to ROLE_GUEST if user is null)
        Tier userTier = (user == null) ? Tier.ROLE_GUEST : Tier.valueOf(user.getRole());

        // 2. Enforce limits for logged-in users
        if (user != null) {
            long currentLinks = urlMappingRepository.countByUser(user);
            if (currentLinks >= userTier.getMaxLinks()) {
                throw new RuntimeException("Limit reached for your current plan (" + userTier.getMaxLinks() + " links). Please upgrade your tier to create more.");
            }
        }

        // 3. Create Mapping
        String shortUrl = generateShortUrl();
        UrlMapping urlMapping = new UrlMapping();
        urlMapping.setOriginalUrl(originalUrl);
        urlMapping.setShortUrl(shortUrl);
        urlMapping.setUser(user);
        urlMapping.setCreatedDate(LocalDateTime.now());

        // 4. Set Expiry Date based on Tier
        if (userTier.getExpirationDays() != null) {
            urlMapping.setExpiresAt(LocalDateTime.now().plusDays(userTier.getExpirationDays()));
        } else {
            urlMapping.setExpiresAt(null); // Never expires
        }

        UrlMapping savedUrlMapping = urlMappingRepository.save(urlMapping);
        return convertToDto(savedUrlMapping);
    }

    private UrlMappingDTO convertToDto(UrlMapping urlMapping){
        UrlMappingDTO urlMappingDTO = new UrlMappingDTO();
        urlMappingDTO.setId(urlMapping.getId());
        urlMappingDTO.setOriginalUrl(urlMapping.getOriginalUrl());
        urlMappingDTO.setShortUrl(urlMapping.getShortUrl());
        urlMappingDTO.setClickCount(urlMapping.getClickCount());
        urlMappingDTO.setCreatedDate(urlMapping.getCreatedDate());

        // NEW: Pass expiration date to frontend
        urlMappingDTO.setExpiresAt(urlMapping.getExpiresAt());

        // Handle guest user safely
        if (urlMapping.getUser() != null) {
            urlMappingDTO.setUsername(urlMapping.getUser().getUsername());
        } else {
            urlMappingDTO.setUsername("Guest");
        }

        return urlMappingDTO;
    }

    private String generateShortUrl() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        Random random = new Random();
        StringBuilder shortUrl = new StringBuilder(8);

        for (int i = 0; i < 8; i++) {
            shortUrl.append(characters.charAt(random.nextInt(characters.length())));
        }
        return shortUrl.toString();
    }

    @Transactional
    public Page<UrlMappingDTO> getUrlsByUser(User user, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdDate"));

        Page<UrlMapping> urlPage = urlMappingRepository.findByUser(user, pageable);

        urlPage.forEach(url -> {
            if (url.getExpiresAt() != null && url.getExpiresAt().isBefore(LocalDateTime.now())) {
                deleteExpiredUrlInternal(url);
            }
        });

        return urlPage.map(this::convertToDto);
    }

    public List<ClickEventDTO> getClickEventsByDate(String shortUrl, LocalDateTime start, LocalDateTime end) {
        UrlMapping urlMapping = urlMappingRepository.findByShortUrl(shortUrl);
        if (urlMapping != null) {
            List<ClickEventRepository.DailyClickCount> dailyCounts = clickEventRepository.findDailyClicksByUrlMapping(
                    urlMapping.getId(), start, end
            );

            return dailyCounts.stream().map(count -> {
                ClickEventDTO dto = new ClickEventDTO();
                dto.setClickDate(LocalDate.parse(count.getClickDate()));
                dto.setCount(count.getCount());
                return dto;
            }).collect(Collectors.toList());
        }
        return null;
    }

    public Map<LocalDate, Long> getTotalClicksByUserAndDate(User user, LocalDate start, LocalDate end) {
        List<ClickEventRepository.DailyClickCount> dailyCounts = clickEventRepository.findTotalDailyClicksByUser(
                user.getId(),
                start.atStartOfDay(),
                end.plusDays(1).atStartOfDay()
        );

        return dailyCounts.stream()
                .collect(Collectors.toMap(
                        count -> LocalDate.parse(count.getClickDate()),
                        ClickEventRepository.DailyClickCount::getCount
                ));
    }

    public UrlMapping getOriginalUrl(String shortUrl) {
        UrlMapping urlMapping = urlMappingRepository.findByShortUrl(shortUrl);
        if (urlMapping != null) {

            if (isExpired(urlMapping)) {
                return null; // Treat it as if it doesn't exist anymore
            }

            urlMapping.setClickCount(urlMapping.getClickCount() + 1);
            urlMappingRepository.save(urlMapping);

            ClickEvent clickEvent = new ClickEvent();
            clickEvent.setClickDate(LocalDateTime.now());
            clickEvent.setUrlMapping(urlMapping);
            clickEventRepository.save(clickEvent);
        }

        return urlMapping;
    }

    @Transactional
    public void deleteUrl(Long id, User user) {
        UrlMapping urlMapping = urlMappingRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("URL not found or you don't have permission to delete it"));

        clickEventRepository.deleteByUrlMapping(urlMapping);
        urlMappingRepository.delete(urlMapping);
    }

    @Transactional
    public void deleteUrlsInBulk(List<Long> ids, User user) {
        List<UrlMapping> urlMappings = urlMappingRepository.findByIdInAndUser(ids, user);

        if (!urlMappings.isEmpty()) {
            clickEventRepository.deleteByUrlMappingIn(urlMappings);
            urlMappingRepository.deleteAll(urlMappings);
        }
    }

    @Transactional
    public UrlMappingDTO updateOriginalUrl(Long id, String newOriginalUrl, User user) {
        UrlMapping urlMapping = urlMappingRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("URL not found or you don't have permission to update it"));

        urlMapping.setOriginalUrl(newOriginalUrl);
        UrlMapping updatedUrlMapping = urlMappingRepository.save(urlMapping);

        return convertToDto(updatedUrlMapping);
    }

    private boolean isExpired(UrlMapping urlMapping) {
        if (urlMapping.getExpiresAt() != null && urlMapping.getExpiresAt().isBefore(LocalDateTime.now())) {
            // It's expired! Perform lazy deletion
            // We use the ID directly to avoid complex object state issues during deletion
            deleteExpiredUrlInternal(urlMapping);
            return true;
        }
        return false;
    }

    @Transactional
    protected void deleteExpiredUrlInternal(UrlMapping urlMapping) {
        // Clean up clicks first, then the mapping
        clickEventRepository.deleteByUrlMapping(urlMapping);
        urlMappingRepository.delete(urlMapping);
    }
}