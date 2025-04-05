import axiosClient from "@/lib/axios"
import { useQuery } from "@tanstack/vue-query"

const fetchFriends = async (userId: number) => {
    const response = await axiosClient.get(`http://localhost:3000/notify/${userId}`);
    return response.data;
};

export const useFriends = (userId: number) => {
    return useQuery({
        queryKey: ["friends"],
        queryFn: () => fetchFriends(userId),
        enabled: !!userId,
        staleTime: 1000 * 60 * 5, 
        retry: false
    });
};
