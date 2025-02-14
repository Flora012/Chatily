import axiosClient from "@/lib/axios";
import { useQuery } from "@tanstack/vue-query";

const searchUsers = async (query: string): Promise<any[]> => {
  if (!query || query.trim().length < 3) return [];
  
  try {
    const response = await axiosClient.get("/users/search", { params: { query } });
    console.log("Keresési eredmények:", response.data);
    return response.data;
  } catch (error) {
    console.error("Hiba történt a keresés során:", error);
    return [];
  }
};

export const useSearchQuery = (searchQuery: string) => {
  return useQuery({
    queryKey: ["searchUsers", searchQuery], // Cache kulcs a keresési eredményekhez
    queryFn: () => searchUsers(searchQuery),
    enabled: searchQuery.length >= 3, // Csak akkor fut le, ha legalább 3 karakter van
  });
};
