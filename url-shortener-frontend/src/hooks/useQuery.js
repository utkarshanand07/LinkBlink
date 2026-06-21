import { useQuery, useMutation, useQueryClient } from "react-query";
import api from "../api/axiosApi";
import dayjs from "dayjs";

export const useFetchMyShortUrls = (token, page, size, onError) => {
    return useQuery(
        ["my-shortenurls", page, size],
        async () => {
            return await api.get(
                `/api/urls/myurls?page=${page}&size=${size}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: "Bearer " + token,
                    },
                }
            );
        },
        {
            select: (data) => {
                // Return the raw Page object from Spring Boot
                return data.data; 
            },
            onError,
            staleTime: 5000
        }
    );
};

export const useFetchTotalClicks = (token, onError) => {
    return useQuery("url-totalclick",
        async () => {
            const currentEndDate = dayjs().format("YYYY-MM-DD");

            return await api.get(
                `/api/urls/totalClicks?startDate=2025-01-01&endDate=${currentEndDate}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: "Bearer " + token,
                    },
                }
            );
        },
        {
            select: (data) => {
                const convertToArray = Object.keys(data.data).map((key) => ({
                    clickDate: key,
                    count: data.data[key],
                }));
                return convertToArray;
            },
            onError,
            staleTime: 5000
        }
    );
};

export const useFetchCurrentUser = (token, onError) => {
    return useQuery(
        ["current-user", token],
        async () => {
            return await api.get(`/api/auth/users/me`, {
                headers: { Accept: "application/json", Authorization: "Bearer " + token },
            });
        }, 
        { 
            select: (data) => data.data, 
            onError, 
            staleTime: 60000,
            enabled: !!token
        }
    );
};

// --- SUBSCRIPTION & MONETIZATION HOOKS ---

// 1. Get the Proration / Cost Preview
export const useFetchCheckoutPreview = (token, targetTier, billingCycle, enabled = false) => {
    return useQuery(
        ["checkout-preview", targetTier, billingCycle],
        async () => {
            return await api.get(`/api/subscriptions/preview?targetTier=${targetTier}&billingCycle=${billingCycle}`, {
                headers: { Accept: "application/json", Authorization: "Bearer " + token },
            });
        },
        { 
            select: (data) => data.data,
            enabled: enabled && !!token, // Only fetch when the modal is open
            staleTime: 0 // Always fetch fresh math
        }
    );
};

// 2. Process the Upgrade/Extension
export const useProcessCheckout = (token) => {
    const queryClient = useQueryClient();
    return useMutation(
        async ({ targetTier, billingCycle }) => {
            return await api.post(`/api/subscriptions/checkout`, 
                { targetTier, billingCycle },
                { headers: { Authorization: "Bearer " + token } }
            );
        },
        { 
            // Invalidate current user so the Dashboard badge updates instantly!
            onSuccess: () => queryClient.invalidateQueries(["current-user", token]) 
        }
    );
};

// 3. Cancel Subscription (Downgrade flag)
export const useCancelSubscription = (token) => {
    const queryClient = useQueryClient();
    return useMutation(
        async () => {
            return await api.post(`/api/subscriptions/cancel`, {}, {
                headers: { Authorization: "Bearer " + token },
            });
        },
        { onSuccess: () => queryClient.invalidateQueries(["current-user", token]) }
    );
};

// 4. Contact Enterprise Sales
export const useSubmitEnterpriseContact = (token) => {
    return useMutation(
        async ({ companyName, expectedLinks }) => {
            return await api.post(`/api/subscriptions/enterprise-contact`, 
                { companyName, expectedLinks },
                { headers: { Authorization: "Bearer " + token } }
            );
        }
    );
};

// ==================================================
// ADVANCED ANALYTICS HOOKS
// ==================================================

// 1. Fetch Total Advanced Analytics (For Main Dashboard)
export const useFetchAdvancedAnalyticsTotal = (token, enabled = true) => {
    return useQuery(
        ["advanced-analytics-total", token],
        async () => {
            return await api.get(`/api/analytics/advanced/total`, {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + token,
                },
            });
        },
        {
            select: (data) => data.data,
            // Only fire if the user has Enterprise access AND the tab requires it
            enabled: enabled && !!token,
            staleTime: 60000, // Cache for 1 minute so switching tabs is instant
            retry: false, // Don't retry if it fails (e.g., 403 or 503)
        }
    );
};

// 2. Fetch Single URL Advanced Analytics (For Link Details)
export const useFetchAdvancedAnalyticsUrl = (token, shortUrl, enabled = false) => {
    return useQuery(
        ["advanced-analytics-url", shortUrl, token],
        async () => {
            return await api.get(`/api/analytics/advanced/url/${shortUrl}`, {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + token,
                },
            });
        },
        {
            select: (data) => data.data,
            // Only fire if the drawer is open AND user has access
            enabled: enabled && !!token && !!shortUrl,
            staleTime: 60000,
            retry: false,
        }
    );
};