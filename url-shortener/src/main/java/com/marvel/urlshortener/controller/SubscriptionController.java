package com.marvel.urlshortener.controller;

import com.marvel.urlshortener.models.BillingCycle;
import com.marvel.urlshortener.models.Tier;
import com.marvel.urlshortener.models.User;
import com.marvel.urlshortener.service.SubscriptionService;
import com.marvel.urlshortener.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/subscriptions")
@AllArgsConstructor
@PreAuthorize("isAuthenticated()")
public class SubscriptionController {
    private final SubscriptionService subscriptionService;
    private final UserService userService;

    // 1. Get the pricing breakdown (so the frontend can show the cart total before paying)
    @GetMapping("/preview")
    public ResponseEntity<Map<String, Object>> previewCheckout(
            Principal principal,
            @RequestParam String targetTier,
            @RequestParam String billingCycle) {

        User user = userService.findByUsername(principal.getName());
        Tier tier = Tier.valueOf("ROLE_" + targetTier.toUpperCase());
        BillingCycle cycle = BillingCycle.valueOf(billingCycle.toUpperCase());

        return ResponseEntity.ok(subscriptionService.calculateCheckoutPreview(user, tier, cycle));
    }

    // 2. Mock Checkout Endpoint (Processes the payment and updates the DB)
    @PostMapping("/checkout")
    public ResponseEntity<Map<String, String>> processCheckout(
            Principal principal,
            @RequestBody Map<String, String> request) {

        User user = userService.findByUsername(principal.getName());
        Tier tier = Tier.valueOf("ROLE_" + request.get("targetTier").toUpperCase());
        BillingCycle cycle = BillingCycle.valueOf(request.get("billingCycle").toUpperCase());

        // In a real app, you would verify the Stripe PaymentIntent here
        subscriptionService.processSubscription(user, tier, cycle);

        return ResponseEntity.ok(Map.of("message", "Subscription successfully activated!"));
    }

    // 3. Cancel Plan
    @PostMapping("/cancel")
    public ResponseEntity<Map<String, String>> cancelSubscription(Principal principal) {
        User user = userService.findByUsername(principal.getName());
        subscriptionService.cancelSubscription(user);
        return ResponseEntity.ok(Map.of("message", "Subscription set to cancel at end of billing period."));
    }

    // 4. Enterprise Request Form
    @PostMapping("/enterprise-contact")
    public ResponseEntity<Map<String, String>> contactEnterprise(
            Principal principal,
            @RequestBody Map<String, String> request) {

        User user = userService.findByUsername(principal.getName());
        subscriptionService.submitEnterpriseRequest(user, request.get("companyName"), request.get("expectedLinks"));

        return ResponseEntity.ok(Map.of("message", "Request received. Our team will contact you shortly."));
    }
}
