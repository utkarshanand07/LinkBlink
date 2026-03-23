import { useQuery, useMutation, useQueryClient } from "react-query";
import api from "../api/axiosApi";

// --- FETCH HOOKS ---

export const useFetchAllUsers = (token, page, size, onError) => {
    return useQuery(
        ["admin-users", page, size],
        async () => {
            return await api.get(`/api/admin/users?page=${page}&size=${size}`, {
                headers: { Accept: "application/json", Authorization: "Bearer " + token },
            });
        },
        { select: (data) => data.data, onError, keepPreviousData: true, staleTime: 5000 }
    );
};

export const useFetchAllLinks = (token, page, size, onError) => {
    return useQuery(
        ["admin-links", page, size],
        async () => {
            return await api.get(`/api/admin/links?page=${page}&size=${size}`, {
                headers: { Accept: "application/json", Authorization: "Bearer " + token },
            });
        },
        { select: (data) => data.data, onError, keepPreviousData: true, staleTime: 5000 }
    );
};

// --- MUTATION HOOKS ---

export const useChangeUserRole = (token) => {
    const queryClient = useQueryClient();
    return useMutation(
        async ({ userId, newRole }) => {
            return await api.put(`/api/admin/users/${userId}/role`, { role: newRole }, {
                headers: { Authorization: "Bearer " + token },
            });
        },
        { onSuccess: () => queryClient.invalidateQueries("admin-users") }
    );
};

export const useBulkDeleteUsers = (token) => {
    const queryClient = useQueryClient();
    return useMutation(
        async (ids) => {
            return await api.delete(`/api/admin/users/bulk`, {
                headers: { Authorization: "Bearer " + token },
                data: { ids },
            });
        },
        { onSuccess: () => queryClient.invalidateQueries("admin-users") }
    );
};

export const useBulkDeleteLinks = (token) => {
    const queryClient = useQueryClient();
    return useMutation(
        async (ids) => {
            return await api.delete(`/api/admin/links/bulk`, {
                headers: { Authorization: "Bearer " + token },
                data: { ids },
            });
        },
        { onSuccess: () => queryClient.invalidateQueries("admin-links") }
    );
};

export const useClearLinkClicks = (token) => {
    const queryClient = useQueryClient();
    return useMutation(
        async (linkId) => {
            return await api.delete(`/api/admin/links/${linkId}/clicks`, {
                headers: { Authorization: "Bearer " + token },
            });
        },
        { onSuccess: () => queryClient.invalidateQueries("admin-links") }
    );
};

export const useCleanupExpiredLinks = (token) => {
    const queryClient = useQueryClient();
    return useMutation(
        async () => {
            return await api.post(`/api/admin/links/cleanup`, {}, {
                headers: { Authorization: "Bearer " + token },
            });
        },
        { onSuccess: () => queryClient.invalidateQueries("admin-links") }
    );
};

// NEW: Clear all clicks for a specific user
export const useClearUserClicks = (token) => {
    const queryClient = useQueryClient();
    return useMutation(
        async (userId) => {
            return await api.delete(`/api/admin/users/${userId}/clicks`, {
                headers: { Authorization: "Bearer " + token },
            });
        },
        { onSuccess: () => queryClient.invalidateQueries("admin-links") }
    );
};

// NEW: Clear all links for a specific user
export const useClearUserLinks = (token) => {
    const queryClient = useQueryClient();
    return useMutation(
        async (userId) => {
            return await api.delete(`/api/admin/users/${userId}/links`, {
                headers: { Authorization: "Bearer " + token },
            });
        },
        { onSuccess: () => queryClient.invalidateQueries("admin-links") }
    );
};