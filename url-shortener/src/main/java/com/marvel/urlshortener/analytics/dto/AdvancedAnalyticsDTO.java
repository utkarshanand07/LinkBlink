package com.marvel.urlshortener.analytics.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AdvancedAnalyticsDTO {
    private List<StatTuple> clicksByCountry;
    private List<StatTuple> clicksByDevice;
    private List<StatTuple> clicksByBrowser;
    private List<StatTuple> clicksByOs;
    private List<StatTuple> clicksByReferrer;
}
