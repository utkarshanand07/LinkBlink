package com.marvel.urlshortener.repository;

import com.marvel.urlshortener.models.UrlMapping;
import com.marvel.urlshortener.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UrlMappingRepository extends JpaRepository<UrlMapping, Long> {
    UrlMapping findByShortUrl(String shortUrl);
    List<UrlMapping> findByUser(User user);

    Page<UrlMapping> findByUser(User user, Pageable pageable);

    Optional<UrlMapping> findByIdAndUser(Long id, User user);
    List<UrlMapping> findByIdInAndUser(List<Long> ids, User user);

    long countByUser(User user);
}
