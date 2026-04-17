package com.marvel.urlshortener.service;

import com.marvel.urlshortener.models.BillingCycle;
import com.marvel.urlshortener.models.Tier;
import com.marvel.urlshortener.models.User;
import com.marvel.urlshortener.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;

@Service
@AllArgsConstructor
public class SubscriptionService {
    private final UserRepository userRepository;

    // 1. Calculate the cost BEFORE they buy (Returns exact amount due + proration credits)
    public Map<String, Object> calculateCheckoutPreview(User user, Tier targetTier, BillingCycle cycle) {
        Map<String, Object> preview = new HashMap<>();

        double newPlanCost = cycle.calculatePrice(targetTier);
        double prorationCredit = 0.0;

        // If they are upgrading to a higher tier while still having active days left
        if (user.getTierExpiresAt() != null && user.getTierExpiresAt().isAfter(LocalDateTime.now())) {
            Tier currentTier = Tier.valueOf(user.getRole());

            // Only prorate if they are UPGRADING (e.g., PRO to ENTERPRISE)
            // If they are just extending their current PRO plan, credit is 0.
            if (!currentTier.equals(targetTier) && !currentTier.equals(Tier.ROLE_BASIC)) {
                long remainingDays = ChronoUnit.DAYS.between(LocalDateTime.now(), user.getTierExpiresAt());
                prorationCredit = remainingDays * BillingCycle.getDailyRate(currentTier);
            }
        }

        double finalAmountDue = Math.max(0, newPlanCost - prorationCredit);

        preview.put("targetTier", targetTier.name());
        preview.put("durationMonths", cycle.getMonths());
        preview.put("subtotal", newPlanCost);
        preview.put("prorationCredit", prorationCredit);
        preview.put("savings", cycle.calculateSavings(targetTier));
        preview.put("amountDue", finalAmountDue);

        return preview;
    }

    // 2. Actually process the upgrade/extension
    @Transactional
    public void processSubscription(User user, Tier targetTier, BillingCycle cycle) {
        LocalDateTime now = LocalDateTime.now();
        Tier currentTier = Tier.valueOf(user.getRole());

        // Scenario A: Extending their current plan
        if (currentTier.equals(targetTier) && user.getTierExpiresAt() != null && user.getTierExpiresAt().isAfter(now)) {
            user.setTierExpiresAt(user.getTierExpiresAt().plusDays(cycle.getDays()));
        }
        // Scenario B: Upgrading to a new plan
        else {
            user.setRole(targetTier.name());
            user.setTierExpiresAt(now.plusDays(cycle.getDays()));
        }

        user.setCancelAtPeriodEnd(false); // Reset cancellation flag upon new purchase
        userRepository.save(user);
    }

    // 3. Cancel Plan (Graceful Downgrade)
    @Transactional
    public void cancelSubscription(User user) {
        user.setCancelAtPeriodEnd(true);
        userRepository.save(user);
    }

    // 4. Custom Enterprise Contact
    public void submitEnterpriseRequest(User user, String companyName, String expectedLinks) {
        // Here you will eventually use JavaMailSender. For now, we simulate it:
        System.out.println("=== NEW ENTERPRISE LEAD ===");
        System.out.println("User: " + user.getEmail());
        System.out.println("Company: " + companyName);
        System.out.println("Links Expected: " + expectedLinks);
        System.out.println("===========================");
    }
}
