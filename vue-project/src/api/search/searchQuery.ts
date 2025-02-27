import axiosClient from "@/lib/axios";
import type { SearchQuery } from "./search";
import { useMutation } from "@tanstack/vue-query";

const search = async (data: SearchQuery) => {
  const response = await axiosClient.post("http://localhost:3000/search/", data);
  return response.data.users; // Fontos: a 'users' tömb visszaadása
};

export const useSearch = () => {
  return useMutation({
      mutationFn: search,
      onSuccess(data) {
          localStorage.setItem("search", JSON.stringify(data));
      },
      onError(error: any) {
          throw new Error(error.response?.data?.error || "Nem található felhasználó!");
      }
  });
};
