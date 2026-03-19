package com.marvel.urlshortener.controller;

import com.marvel.urlshortener.dtos.ClickEventDTO;
import com.marvel.urlshortener.dtos.UrlMappingDTO;
import com.marvel.urlshortener.models.User;
import com.marvel.urlshortener.service.UrlMappingService;
import com.marvel.urlshortener.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/urls")
@AllArgsConstructor
public class UrlMappingController {
    private UrlMappingService urlMappingService;
    private UserService userService;

    // REMOVED @PreAuthorize so guests can access
    @PostMapping("/shorten")
    public ResponseEntity<?> createShortUrl(@RequestBody Map<String, String> request,
                                            Principal principal){
        String originalUrl = request.get("originalUrl");
        User user = null;

        if (principal != null) {
            user = userService.findByUsername(principal.getName());
        }

        try {
            UrlMappingDTO urlMappingDTO = urlMappingService.createShortUrl(originalUrl, user);
            return ResponseEntity.ok(urlMappingDTO);
        } catch (RuntimeException e) {
            // Return 403 Forbidden if they hit their tier limit
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        }
    }

    // UPDATED Authorization to match your new Tier names
    @GetMapping("/myurls")
    @PreAuthorize("hasAnyRole('BASIC', 'PRO', 'ENTERPRISE', 'ADMIN')")
    public ResponseEntity<Page<UrlMappingDTO>> getUserUrls(
            Principal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size){

        User user = userService.findByUsername(principal.getName());
        Page<UrlMappingDTO> urls = urlMappingService.getUrlsByUser(user, page, size);
        return ResponseEntity.ok(urls);
    }

    @GetMapping("/analytics/{shortUrl}")
    @PreAuthorize("hasAnyRole('BASIC', 'PRO', 'ENTERPRISE', 'ADMIN')")
    public ResponseEntity<List<ClickEventDTO>> getUrlAnalytics(@PathVariable String shortUrl,
                                                               @RequestParam("startDate") String startDate,
                                                               @RequestParam("endDate") String endDate){
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        LocalDateTime start = LocalDateTime.parse(startDate, formatter);
        LocalDateTime end = LocalDateTime.parse(endDate, formatter);
        List<ClickEventDTO> clickEventDTOS = urlMappingService.getClickEventsByDate(shortUrl, start, end);
        return ResponseEntity.ok(clickEventDTOS);
    }

    @GetMapping("/totalClicks")
    @PreAuthorize("hasAnyRole('BASIC', 'PRO', 'ENTERPRISE', 'ADMIN')")
    public ResponseEntity<Map<LocalDate, Long>> getTotalClicksByDate(Principal principal,
                                                                     @RequestParam("startDate") String startDate,
                                                                     @RequestParam("endDate") String endDate){
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE;
        User user = userService.findByUsername(principal.getName());
        LocalDate start = LocalDate.parse(startDate, formatter);
        LocalDate end = LocalDate.parse(endDate, formatter);
        Map<LocalDate, Long> totalClicks = urlMappingService.getTotalClicksByUserAndDate(user, start, end);
        return ResponseEntity.ok(totalClicks);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('BASIC', 'PRO', 'ENTERPRISE', 'ADMIN')")
    public ResponseEntity<Void> deleteUrl(@PathVariable Long id, Principal principal) {
        User user = userService.findByUsername(principal.getName());
        urlMappingService.deleteUrl(id, user);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/bulk")
    @PreAuthorize("hasAnyRole('BASIC', 'PRO', 'ENTERPRISE', 'ADMIN')")
    public ResponseEntity<Void> deleteBulkUrls(@RequestBody Map<String, List<Long>> request, Principal principal) {
        User user = userService.findByUsername(principal.getName());
        List<Long> ids = request.get("ids");

        if (ids != null && !ids.isEmpty()) {
            urlMappingService.deleteUrlsInBulk(ids, user);
        }
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('BASIC', 'PRO', 'ENTERPRISE', 'ADMIN')")
    public ResponseEntity<UrlMappingDTO> updateUrl(@PathVariable Long id,
                                                   @RequestBody Map<String, String> request,
                                                   Principal principal) {
        User user = userService.findByUsername(principal.getName());
        String newOriginalUrl = request.get("originalUrl");

        UrlMappingDTO updatedUrlDTO = urlMappingService.updateOriginalUrl(id, newOriginalUrl, user);
        return ResponseEntity.ok(updatedUrlDTO);
    }
}
