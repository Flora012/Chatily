// Frissítjük a frontend keresőlekérdezését
import axiosClient from "@/lib/axios";
import { ref, watchEffect } from "vue";

const searchUsers = async (query) => {
  if (!query || query.trim().length < 3) return [];
  const response = await axiosClient.get(`http://localhost:3000/search/`, { params: { query } });
  return response.data;
};

export const useSearchQuery = (searchQuery) => {
  const results = ref([]);

  watchEffect(async () => {
    if (searchQuery.value && searchQuery.value.trim().length >= 3) {
      results.value = await searchUsers(searchQuery.value);
    } else {
      results.value = [];
    }
  });

  return results;
};