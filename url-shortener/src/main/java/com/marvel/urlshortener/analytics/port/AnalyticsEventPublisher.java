package com.marvel.urlshortener.analytics.port;

import com.marvel.urlshortener.analytics.dto.RawClickPayload;

public interface AnalyticsEventPublisher {
    void publish(RawClickPayload payload);
}
