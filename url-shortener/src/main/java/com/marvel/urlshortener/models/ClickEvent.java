package com.marvel.urlshortener.models;

import com.marvel.urlshortener.models.enums.Browser;
import com.marvel.urlshortener.models.enums.DeviceType;
import com.marvel.urlshortener.models.enums.Os;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClickEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime clickDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "url_mapping_id")
    private UrlMapping urlMapping;

    // --- ADVANCED ANALYTICS FIELDS (Will be NULL for Basic users) ---

    // Geolocation
    private String ip;
    private String country;
    private String city;

    // Device Intelligence
    @Enumerated(EnumType.STRING)
    private Os os;

    @Enumerated(EnumType.STRING)
    private Browser browser;

    @Enumerated(EnumType.STRING)
    private DeviceType deviceType;

    private String referrer;
}
