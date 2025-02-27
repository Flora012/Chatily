import axiosClient from "@/lib/axios";
import { useQuery } from "@tanstack/vue-query";

const fetchCurrentUser = async () => {
    const response = await axiosClient.get("/user/me"); 
    return response.data;
};

export const useCurrentUser = () => {
    return useQuery({
        queryKey: ["currentUser"],
        queryFn: fetchCurrentUser,
    });
};
