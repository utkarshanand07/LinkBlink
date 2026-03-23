import { useQuery, useMutation, useQueryClient } from "react-query";
import api from "../api/axiosApi";

// --- USERS FETCH ---
export const useFetchAllUsers = (token, page, size, onError) => {
    return useQuery(
        ["admin-users", page, size],
        async () => {
            return await api.get(`/api/admin/users?page=${page}&size=${size}`, {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + token,
                },
            });
        },
        {
            select: (data) => data.data,
            onError,
            keepPreviousData: true,
            staleTime: 5000,
        }
    );
};

// --- LINKS FETCH ---
export const useFetchAllLinks = (token, page, size, onError) => {
    return useQuery(
        ["admin-links", page, size],
        async () => {
            return await api.get(`/api/admin/links?page=${page}&size=${size}`, {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + token,
                },
            });
        },
        {
            select: (data) => data.data,
            onError,
            keepPreviousData: true,
            staleTime: 5000,
        }
    );
};