package com.marvel.urlshortener.analytics.port;

import com.marvel.urlshortener.models.ClickEvent;

public interface AdvancedAnalyticsRepository {
    void saveAnalytics(ClickEvent event);
}
