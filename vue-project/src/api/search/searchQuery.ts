import axiosClient from "@/lib/axios";
import { useRoute, useRouter } from "vue-router"
import type { SearchQuery } from "./search";
import { useMutation, useQuery } from "@tanstack/vue-query"


const search = async (data: SearchQuery)=> {
  const response = await axiosClient.post("http://localhost:3000/search", data)
  return response.data.data
}

export const useSearch = () => {
  return useMutation({
      mutationFn: search,
      onSuccess(data) {
          localStorage.setItem("search", JSON.stringify(data))
      },
      onError(error:any){
          throw new Error(error.response?.data?.error || "Nem található a felhasználó!");

      }
  })
}
