package com.marvel.urlshortener.repository;

import com.marvel.urlshortener.models.ClickEvent;
import com.marvel.urlshortener.models.UrlMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ClickEventRepository extends JpaRepository<ClickEvent, Long> {
    // SHARED: UrlMappingService & AdminService (Deletions)

    // Used when deleting a single URL to prevent Foreign Key errors
    void deleteByUrlMapping(UrlMapping urlMapping);

    // Used during Bulk Deletes and Admin cleanup jobs
    void deleteByUrlMappingIn(List<UrlMapping> urlMappings);


    // USED BY: AdminService (Analytics Management)

    // Admin: Wipe all click history for a specific link without fetching the entities first
    void deleteByUrlMappingId(Long urlMappingId);


    // USED BY: UrlMappingService (Legacy Fallbacks)

    // Note: These are kept for backward compatibility, but the optimized Native Queries below are preferred.
    List<ClickEvent> findByUrlMappingAndClickDateBetween(UrlMapping mapping, LocalDateTime startDate, LocalDateTime endDate);
    List<ClickEvent> findByUrlMappingInAndClickDateBetween(List<UrlMapping> urlMappings, LocalDateTime startDate, LocalDateTime endDate);


    // USED BY: UrlMappingService (Optimized Analytics)

    // Projection interface to hold the mapped SQL results
    interface DailyClickCount {
        String getClickDate(); // MySQL DATE() returns YYYY-MM-DD as a String
        Long getCount();
    }

    // 1. Optimized query for a specific user's total clicks across all their links
    @Query(value = "SELECT DATE(c.click_date) as clickDate, COUNT(c.id) as count " +
            "FROM click_event c JOIN url_mapping u ON c.url_mapping_id = u.id " +
            "WHERE u.user_id = :userId AND c.click_date >= :startDate AND c.click_date < :endDate " +
            "GROUP BY DATE(c.click_date)",
            nativeQuery = true)
    List<DailyClickCount> findTotalDailyClicksByUser(
            @Param("userId") Long userId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    // 2. Optimized query for a single specific URL's clicks
    @Query(value = "SELECT DATE(c.click_date) as clickDate, COUNT(c.id) as count " +
            "FROM click_event c " +
            "WHERE c.url_mapping_id = :urlId AND c.click_date >= :startDate AND c.click_date <= :endDate " +
            "GROUP BY DATE(c.click_date)",
            nativeQuery = true)
    List<DailyClickCount> findDailyClicksByUrlMapping(
            @Param("urlId") Long urlId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
}
