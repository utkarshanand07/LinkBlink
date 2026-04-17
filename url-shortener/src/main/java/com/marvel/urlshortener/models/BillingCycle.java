package com.marvel.urlshortener.models;

import lombok.Getter;

@Getter
public enum BillingCycle {
    MONTH_1(1, 30, 1.0),      // No discount
    MONTH_3(3, 90, 0.90),     // 10% off
    MONTH_6(6, 180, 0.85),    // 15% off
    YEAR_1(12, 365, 0.80);    // 20% off

    private final int months;
    private final int days;
    private final double discountMultiplier;

    // --- BASE MONTHLY PRICES (In USD) ---
    private static final double PRO_BASE_PRICE = 9.99;
    private static final double ENTERPRISE_BASE_PRICE = 29.99;

    BillingCycle(int months, int days, double discountMultiplier) {
        this.months = months;
        this.days = days;
        this.discountMultiplier = discountMultiplier;
    }

    // Calculates the final price based on the selected tier and this duration's discount
    public double calculatePrice(Tier targetTier) {
        double basePrice = targetTier == Tier.ROLE_ENTERPRISE ? ENTERPRISE_BASE_PRICE : PRO_BASE_PRICE;
        return (basePrice * this.months) * this.discountMultiplier;
    }

    // Helps the frontend show "You save $X!"
    public double calculateSavings(Tier targetTier) {
        double basePrice = targetTier == Tier.ROLE_ENTERPRISE ? ENTERPRISE_BASE_PRICE : PRO_BASE_PRICE;
        double costWithoutDiscount = basePrice * this.months;
        return costWithoutDiscount - calculatePrice(targetTier);
    }

    // Calculates the daily rate to help with Proration math
    public static double getDailyRate(Tier tier) {
        return (tier == Tier.ROLE_ENTERPRISE ? ENTERPRISE_BASE_PRICE : PRO_BASE_PRICE) / 30.0;
    }
}
