package com.marvel.urlshortener.analytics.adapter.mq;

import com.marvel.urlshortener.analytics.dto.RawClickPayload;
import com.marvel.urlshortener.analytics.port.AnalyticsEventPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
@ConditionalOnProperty(name = "analytics.mq.type", havingValue = "async", matchIfMissing = true)
public class AsyncEventPublisher implements AnalyticsEventPublisher {
    private final ApplicationEventPublisher springPublisher;

    @Override
    public void publish(RawClickPayload payload) {
        log.debug("Publishing payload via Spring @Async: {}", payload.getShortUrl());
        // Throws it into Spring's internal event bus
        springPublisher.publishEvent(payload);
    }
}
