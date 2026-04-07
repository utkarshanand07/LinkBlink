import { useQuery } from "react-query";
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