package com.marvel.urlshortener.analytics.adapter.db;

import com.marvel.urlshortener.analytics.port.AdvancedAnalyticsRepository;
import com.marvel.urlshortener.models.ClickEvent;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.stereotype.Repository;

@Repository
@ConditionalOnExpression("${analytics.enabled:false} == true and '${analytics.db.type:postgres}'.equals('tinybird')")
public class TinybirdAnalyticsAdapter implements AdvancedAnalyticsRepository {
    @Override
    public void saveAnalytics(ClickEvent event) {
        // TODO: Map ClickEvent to JSON and POST to Tinybird Events API
        System.out.println("Sending data to Tinybird: " + event.getUrlMapping().getShortUrl());
    }
}
