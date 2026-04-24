package com.marvel.urlshortener.service;

import com.maxmind.geoip2.DatabaseReader;
import com.maxmind.geoip2.exception.GeoIp2Exception;
import com.maxmind.geoip2.model.CityResponse;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.net.InetAddress;

@Slf4j
@Service
public class GeoLocationService {
    private DatabaseReader dbReader;

    @PostConstruct
    public void init() {
        try {
            // Loads the free MaxMind database from the resources folder
            InputStream database = new ClassPathResource("GeoLite2-City.mmdb").getInputStream();
            this.dbReader = new DatabaseReader.Builder(database).build();
        } catch (IOException e) {
            log.error("Failed to load GeoLite2-City database. Geographic tracking will be disabled.", e);
        }
    }

    public LocationData getLocation(String ipAddress) {
        if (dbReader == null || ipAddress == null || ipAddress.isEmpty() || ipAddress.equals("127.0.0.1") || ipAddress.equals("0:0:0:0:0:0:0:1")) {
            return new LocationData("Unknown", "Unknown");
        }

        try {
            InetAddress ip = InetAddress.getByName(ipAddress);
            CityResponse response = dbReader.city(ip);

            String country = response.getCountry().getName();
            String city = response.getCity().getName();

            return new LocationData(
                    country != null ? country : "Unknown",
                    city != null ? city : "Unknown"
            );
        } catch (IOException | GeoIp2Exception e) {
            // IP might not be in the database, which is normal for internal IPs
            return new LocationData("Unknown", "Unknown");
        }
    }

    // Simple inner class to return both data points cleanly
    public record LocationData(String country, String city) {}
}
