package com.marvel.urlshortener.analytics.adapter.db;

import com.marvel.urlshortener.analytics.port.AdvancedAnalyticsRepository;
import com.marvel.urlshortener.models.ClickEvent;
import com.marvel.urlshortener.repository.ClickEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
@ConditionalOnExpression("${analytics.enabled:false} == true and '${analytics.db.type:postgres}'.equals('postgres')")
public class PostgresAnalyticsAdapter implements AdvancedAnalyticsRepository {
    private final ClickEventRepository jpaRepository;

    @Override
    public void saveAnalytics(ClickEvent event) {
        jpaRepository.save(event);
    }
}
