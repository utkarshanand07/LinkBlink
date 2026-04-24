package com.marvel.urlshortener.analytics.adapter.mq;

import com.marvel.urlshortener.analytics.dto.RawClickPayload;
import com.marvel.urlshortener.analytics.port.AnalyticsEventPublisher;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@ConditionalOnExpression("${analytics.enabled:false} == true and '${analytics.mq.type:async}'.equals('upstash')")
public class UpstashEventPublisher implements AnalyticsEventPublisher {
    @Override
    public void publish(RawClickPayload payload) {
        log.info("Publishing payload via Upstash Kafka HTTP API...");
        // TODO: Use RestTemplate/WebClient to POST to Upstash endpoint
    }
}
