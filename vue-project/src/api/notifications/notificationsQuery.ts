import axiosClient from "@/lib/axios";
import { useQuery } from "@tanstack/vue-query";
import type { LoggedInUser } from "@/api/notifications/notifications";

const fetchNotifications = async (data: LoggedInUser) => {
  try {
    const response = await axiosClient.post("http://localhost:3000/notifications", data);
    
    return response.data;
  } catch (error: any) {
    console.error("Értesítések lekérése sikertelen:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || "Értesítések lekérése sikertelen!");
  }
};

export const useNotifications = (userData:LoggedInUser) => {

  return useQuery({
    queryKey: ["notifications", userData],
    queryFn: () => fetchNotifications(userData),
    enabled: false 
  });
};
