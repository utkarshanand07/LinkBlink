package com.marvel.urlshortener.repository;

import com.marvel.urlshortener.models.UrlMapping;
import com.marvel.urlshortener.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UrlMappingRepository extends JpaRepository<UrlMapping, Long> {
    // USED BY: UrlMappingService (Core App Logic)

    UrlMapping findByShortUrl(String shortUrl);

    Optional<UrlMapping> findByIdAndUser(Long id, User user);

    List<UrlMapping> findByIdInAndUser(List<Long> ids, User user);

    // Used to enforce Tier limits during link creation
    long countByUser(User user);


    // SHARED: UrlMappingService & AdminService

    // Used by UrlMappingService (Dashboard) and AdminService (Viewing specific user links)
    Page<UrlMapping> findByUser(User user, Pageable pageable);

    // Used by UrlMappingService (Total Clicks limit check) and AdminService (Cascading deletes)
    List<UrlMapping> findByUser(User user);


    // USED BY: AdminService (Super Admin Dashboard)

    // Admin: Fetch all links in the entire database (paginated)
    Page<UrlMapping> findAll(Pageable pageable);

    // Admin: Filter links by when they were created
    Page<UrlMapping> findByCreatedDateBetween(LocalDateTime start, LocalDateTime end, Pageable pageable);

    // Admin: Filter links by when they expire
    Page<UrlMapping> findByExpiresAtBetween(LocalDateTime start, LocalDateTime end, Pageable pageable);

    // Admin: Find all expired links for the cleanup job
    List<UrlMapping> findByExpiresAtBefore(LocalDateTime time);

    // Admin: Get count of links created after a specific time (e.g., start of today)
    long countByCreatedDateAfter(LocalDateTime date);

    // Admin: Get count of links made by guests (where user is null)
    long countByUserIsNull();
}
