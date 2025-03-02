import axiosClient from "@/lib/axios";
import { useQuery, useMutation } from "@tanstack/vue-query";
import { QUERY_KEYS } from "@/utils/queryKeys";
import axios from "axios";
import type { FriendRequest } from "@/api/notifications/notifications";

// 📌 Értesítések lekérése (GET)
const fetchNotifications = async (): Promise<FriendRequest> => {
    const email = localStorage.getItem("userEmail");
    console.log("📩 Küldött email a backendnek:", email);

    const response = await axiosClient.post("http://localhost:3000/notifications2", { email });

    return response.data;
};




export const useNotifications = (userId: number) => {
    return useQuery({
        queryKey: [`notifications-${userId}`], // Egy stringként kezeljük
        queryFn: async () => {
            const { data } = await axios.get(`/api/notifications/${userId}`);
            return data;
        },
        enabled: !!userId, // Csak akkor fut le, ha van userId
    });
};




// 📌 Ismerős kérés elfogadása (POST)
const acceptFriendRequest = async (id: number) => {
    await axiosClient.post(`http://localhost:3000/notifications2/${id}/accept`);
};

export const useAcceptFriendRequest = () => {
    return useMutation({
        mutationFn: acceptFriendRequest,
    });
};

// 📌 Ismerős kérés elutasítása (POST)
const rejectFriendRequest = async (id: number) => {
    await axiosClient.post(`http://localhost:3000/notifications2/${id}/reject`);
};

export const useRejectFriendRequest = () => {
    return useMutation({
        mutationFn: rejectFriendRequest,
    });
};
