package com.marvel.urlshortener.models;

public enum Tier {
    // Format: (expirationDays, maxLinks, canUseCustomAlias, hasAnalytics, hasAdvancedAnalytics)

    ROLE_GUEST(7, 0, false, false, false),
    ROLE_BASIC(30, 50, false, true, false),
    ROLE_PRO(365, 1000, true, true, false),
    ROLE_ENTERPRISE(null, 10000, true, true, true),
    ROLE_ADMIN(null, Integer.MAX_VALUE, true, true, true);

    private final Integer expirationDays;
    private final int maxLinks;
    private final boolean canUseCustomAlias;
    private final boolean hasAnalytics;
    private final boolean hasAdvancedAnalytics;

    Tier(Integer expirationDays, int maxLinks, boolean canUseCustomAlias, boolean hasAnalytics, boolean hasAdvancedAnalytics) {
        this.expirationDays = expirationDays;
        this.maxLinks = maxLinks;
        this.canUseCustomAlias = canUseCustomAlias;
        this.hasAnalytics = hasAnalytics;
        this.hasAdvancedAnalytics = hasAdvancedAnalytics;
    }

    public Integer getExpirationDays() { return expirationDays; }
    public int getMaxLinks() { return maxLinks; }
    public boolean canUseCustomAlias() { return canUseCustomAlias; }
    public boolean hasAnalytics() { return hasAnalytics; }
    public boolean hasAdvancedAnalytics() { return hasAdvancedAnalytics; }
}
