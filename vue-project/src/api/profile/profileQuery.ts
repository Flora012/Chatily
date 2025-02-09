import axiosClient from "@/lib/axios"
import { useQuery } from "@tanstack/vue-query"
import type { Profile } from "./profile"

const getLoggedUser = async (): Promise<Profile> => {
    const loginToken = JSON.parse(localStorage.getItem("login") ?? "")
    let token = ""
    if(loginToken && loginToken?.token){
        token = String(loginToken.token)
    }
    const response = await axiosClient.get(`http://172.22.1.219/api/v1/user`, {
     headers: {Authorization:"Bearer "+token} 
    }
    )
    return response.data.data
}

export const useGetLoggedUser = () => {
    return useQuery(
        {
            queryKey: ["getLoggedUser"],
            queryFn: getLoggedUser,
        }
    )
}
