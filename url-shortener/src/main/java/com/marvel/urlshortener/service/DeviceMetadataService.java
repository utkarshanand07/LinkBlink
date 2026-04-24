package com.marvel.urlshortener.service;

import com.marvel.urlshortener.models.enums.Browser;
import com.marvel.urlshortener.models.enums.DeviceType;
import com.marvel.urlshortener.models.enums.Os;
import jakarta.annotation.PostConstruct;
import nl.basjes.parse.useragent.UserAgent;
import nl.basjes.parse.useragent.UserAgentAnalyzer;
import org.springframework.stereotype.Service;

@Service
public class DeviceMetadataService {
    private UserAgentAnalyzer uaa;

    // Initialize the analyzer once when the application starts
    @PostConstruct
    public void init() {
        this.uaa = UserAgentAnalyzer.newBuilder()
                .hideMatcherLoadStats()
                .withCache(10000)
                .build();
    }

    public DeviceType extractDeviceType(String userAgentString) {
        if (userAgentString == null || userAgentString.isEmpty()) return DeviceType.UNKNOWN;
        UserAgent agent = uaa.parse(userAgentString);
        String deviceClass = agent.getValue(UserAgent.DEVICE_CLASS);

        if (deviceClass == null) return DeviceType.UNKNOWN;
        if (deviceClass.equals("Desktop")) return DeviceType.DESKTOP;
        if (deviceClass.equals("Mobile")) return DeviceType.MOBILE;
        if (deviceClass.equals("Tablet")) return DeviceType.TABLET;
        if (deviceClass.contains("Bot") || deviceClass.contains("Spider")) return DeviceType.BOT;

        return DeviceType.UNKNOWN;
    }

    public Os extractOs(String userAgentString) {
        if (userAgentString == null || userAgentString.isEmpty()) return Os.UNKNOWN;
        UserAgent agent = uaa.parse(userAgentString);
        String osName = agent.getValue(UserAgent.OPERATING_SYSTEM_NAME_VERSION);

        if (osName == null) return Os.UNKNOWN;
        String lowerOs = osName.toLowerCase();

        if (lowerOs.contains("windows")) return Os.WINDOWS;
        if (lowerOs.contains("mac")) return Os.MACOS;
        if (lowerOs.contains("linux")) return Os.LINUX;
        if (lowerOs.contains("ios")) return Os.IOS;
        if (lowerOs.contains("android")) return Os.ANDROID;

        return Os.OTHER;
    }

    public Browser extractBrowser(String userAgentString) {
        if (userAgentString == null || userAgentString.isEmpty()) return Browser.UNKNOWN;
        UserAgent agent = uaa.parse(userAgentString);
        String browserName = agent.getValue(UserAgent.AGENT_NAME);

        if (browserName == null) return Browser.UNKNOWN;
        String lowerBrowser = browserName.toLowerCase();

        if (lowerBrowser.contains("chrome")) return Browser.CHROME;
        if (lowerBrowser.contains("safari") && !lowerBrowser.contains("chrome")) return Browser.SAFARI;
        if (lowerBrowser.contains("firefox")) return Browser.FIREFOX;
        if (lowerBrowser.contains("edge")) return Browser.EDGE;
        if (lowerBrowser.contains("brave")) return Browser.BRAVE;

        return Browser.OTHER;
    }
}
