import axiosClient from "@/lib/axios";
import { useQuery } from "@tanstack/vue-query";

// A keresési funkció, amely a backenddel kommunikál
const searchUsers = async (query: string) => {
  if (!query || query.length < 3) return [];
  const response = await axiosClient.get(`http://localhost:3000/search/`);
  return response.data;
};

export const useSearchQuery = (searchQuery: string) => {
  return useQuery({
    queryKey: ["searchUsers", searchQuery],
    queryFn: () => searchUsers(searchQuery),
    enabled: searchQuery.length >= 3, 
  });
};
