package com.marvel.urlshortener.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RawClickPayload {
    private String shortUrl;
    private String ipAddress;
    private String userAgent;
    private String referrer;
    private LocalDateTime timestamp;
}
