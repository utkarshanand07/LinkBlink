package com.marvel.urlshortener.service;

import com.marvel.urlshortener.dtos.UrlMappingDTO;
import com.marvel.urlshortener.dtos.UserDTO;
import com.marvel.urlshortener.models.Tier;
import com.marvel.urlshortener.models.UrlMapping;
import com.marvel.urlshortener.models.User;
import com.marvel.urlshortener.repository.ClickEventRepository;
import com.marvel.urlshortener.repository.UrlMappingRepository;
import com.marvel.urlshortener.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@AllArgsConstructor
public class AdminService {
    private final UserRepository userRepository;
    private final UrlMappingRepository urlMappingRepository;
    private final ClickEventRepository clickEventRepository;

    // --- USER MANAGEMENT ---

    public Page<UserDTO> getAllUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        return userRepository.findAll(pageable).map(this::convertToUserDTO);
    }

    @Transactional
    public void changeUserRole(Long userId, String newRole, Integer durationDays) {
        if ("ROLE_GUEST".equals(newRole)) {
            throw new RuntimeException("Cannot assign GUEST role to a registered user.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        try {
            Tier tier = Tier.valueOf(newRole);
            user.setRole(tier.name());

            // Handle Expiration Logic
            if ("ROLE_BASIC".equals(newRole)) {
                user.setTierExpiresAt(null); // Basic is forever
            } else if (durationDays != null && durationDays > 0) {
                user.setTierExpiresAt(LocalDateTime.now().plusDays(durationDays));
            } else {
                user.setTierExpiresAt(null); // Null means infinite (Lifetime Pro/Admin)
            }

            userRepository.save(user);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role provided.");
        }
    }

    @Transactional
    public void deleteUsers(List<Long> userIds) {
        List<User> users = userRepository.findAllById(userIds);
        for (User user : users) {
            // 1. Find all their links
            List<UrlMapping> userLinks = urlMappingRepository.findByUser(user);
            if (!userLinks.isEmpty()) {
                // 2. Delete all analytics for those links
                clickEventRepository.deleteByUrlMappingIn(userLinks);
                // 3. Delete the links
                urlMappingRepository.deleteAll(userLinks);
            }
            // 4. Finally, delete the user
            userRepository.delete(user);
        }
    }

    // --- LINK MANAGEMENT ---

    public Page<UrlMappingDTO> getAllLinks(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdDate"));
        return urlMappingRepository.findAll(pageable).map(this::convertToUrlDTO);
    }

    public Page<UrlMappingDTO> getLinksByUser(Long userId, int page, int size) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdDate"));
        return urlMappingRepository.findByUser(user, pageable).map(this::convertToUrlDTO);
    }

    public Page<UrlMappingDTO> getLinksByDateRange(LocalDateTime start, LocalDateTime end, String dateType, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdDate"));
        if ("expiry".equalsIgnoreCase(dateType)) {
            return urlMappingRepository.findByExpiresAtBetween(start, end, pageable).map(this::convertToUrlDTO);
        } else {
            return urlMappingRepository.findByCreatedDateBetween(start, end, pageable).map(this::convertToUrlDTO);
        }
    }

    @Transactional
    public void deleteLinks(List<Long> linkIds) {
        List<UrlMapping> links = urlMappingRepository.findAllById(linkIds);
        if (!links.isEmpty()) {
            clickEventRepository.deleteByUrlMappingIn(links);
            urlMappingRepository.deleteAll(links);
        }
    }

    @Transactional
    public void clearLinksForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<UrlMapping> userLinks = urlMappingRepository.findByUser(user);
        if (!userLinks.isEmpty()) {
            clickEventRepository.deleteByUrlMappingIn(userLinks);
            urlMappingRepository.deleteAll(userLinks);
        }
    }

    @Transactional
    public int cleanupExpiredLinks() {
        // Find ONLY the expired links directly via the database
        // Requires: List<UrlMapping> findByExpiresAtBefore(LocalDateTime time); in UrlMappingRepository
        List<UrlMapping> expiredLinks = urlMappingRepository.findByExpiresAtBefore(LocalDateTime.now());

        if (!expiredLinks.isEmpty()) {
            // Delete analytics first to prevent foreign key constraints
            clickEventRepository.deleteByUrlMappingIn(expiredLinks);
            // Then delete the mappings
            urlMappingRepository.deleteAll(expiredLinks);
        }
        return expiredLinks.size();
    }

    // --- ANALYTICS MANAGEMENT ---

    @Transactional
    public void clearClicksForLink(Long linkId) {
        clickEventRepository.deleteByUrlMappingId(linkId);

        // Reset the counter on the URL entity
        UrlMapping mapping = urlMappingRepository.findById(linkId).orElse(null);
        if (mapping != null) {
            mapping.setClickCount(0);
            urlMappingRepository.save(mapping);
        }
    }

    @Transactional
    public void clearClicksForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<UrlMapping> userLinks = urlMappingRepository.findByUser(user);

        if (!userLinks.isEmpty()) {
            clickEventRepository.deleteByUrlMappingIn(userLinks);
            // Reset counters
            userLinks.forEach(link -> link.setClickCount(0));
            urlMappingRepository.saveAll(userLinks);
        }
    }

    @Transactional
    public Map<String, Long> getPlatformMetrics() {
        LocalDateTime startOfDay = java.time.LocalDate.now().atStartOfDay();

        long totalUsers = userRepository.count();
        long totalLinks = urlMappingRepository.count();
        long guestLinks = urlMappingRepository.countByUserIsNull();
        long linksToday = urlMappingRepository.countByCreatedDateAfter(startOfDay);
        long totalClicks = clickEventRepository.count();

        return Map.of(
                "totalUsers", totalUsers,
                "totalLinks", totalLinks,
                "guestLinks", guestLinks,
                "registeredLinks", (totalLinks - guestLinks),
                "linksToday", linksToday,
                "totalClicks", totalClicks
        );
    }

    // --- SUBSCRIPTION MAINTENANCE ---

    @Transactional
    public int demoteExpiredUsers() {
        // Find users whose tier has expired
        // Requires: List<User> findByTierExpiresAtBefore(LocalDateTime time); in UserRepository
        List<User> expiredUsers = userRepository.findByTierExpiresAtBefore(LocalDateTime.now());

        if (!expiredUsers.isEmpty()) {
            for (User user : expiredUsers) {
                user.setRole("ROLE_BASIC"); // Fallback tier
                user.setTierExpiresAt(null); // Wipe expiration so they stay basic forever
            }
            userRepository.saveAll(expiredUsers);
        }
        return expiredUsers.size();
    }

    // --- HELPERS ---

    private UserDTO convertToUserDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setUsername(user.getUsername());
        dto.setRole(user.getRole());
        dto.setTierExpiresAt(user.getTierExpiresAt());
        return dto;
    }

    private UrlMappingDTO convertToUrlDTO(UrlMapping urlMapping) {
        UrlMappingDTO dto = new UrlMappingDTO();
        dto.setId(urlMapping.getId());
        dto.setOriginalUrl(urlMapping.getOriginalUrl());
        dto.setShortUrl(urlMapping.getShortUrl());
        dto.setClickCount(urlMapping.getClickCount());
        dto.setCreatedDate(urlMapping.getCreatedDate());
        dto.setExpiresAt(urlMapping.getExpiresAt());
        dto.setUsername(urlMapping.getUser() != null ? urlMapping.getUser().getUsername() : "Guest");
        return dto;
    }
}
