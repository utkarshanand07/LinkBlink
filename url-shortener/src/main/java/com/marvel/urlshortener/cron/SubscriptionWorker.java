package com.marvel.urlshortener.cron;

import com.marvel.urlshortener.service.AdminService;
import lombok.AllArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class SubscriptionWorker {
    private final AdminService adminService;

    // Runs automatically every day at 00:00 (Midnight)
    @Scheduled(cron = "0 0 0 * * ?")
    public void runNightlySubscriptionSweep() {
        System.out.println("Running nightly subscription sweep...");
        int demotedCount = adminService.demoteExpiredUsers();
        System.out.println("Sweep complete. Demoted " + demotedCount + " users back to ROLE_BASIC.");
    }
}
