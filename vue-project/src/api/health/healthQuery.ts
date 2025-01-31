import axiosClient from "@/lib/axios"
import type { Health, HealthData } from "./health"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { QUERY_KEYS } from "@/utils/queryKeys"
import queryClient from "@/lib/queryClient"

const getHealth = async () : Promise<Health> =>{
    const response = await axiosClient.get("http://172.22.1.219/api/health", {})
    return response.data
}

export const useGetHealth = () =>{
    return useQuery(
        {
            queryKey: [QUERY_KEYS.health], 
            queryFn: getHealth,
        }
    )
}

const createHealth = async (data: HealthData) : Promise<Health> =>{
    const response = await axiosClient.post("172.22.1.219/api/v1/registration", data)
    return response.data
}

export const useCreateHealth = () => {

    return useMutation({
        mutationFn: createHealth,
        onSuccess: (response: Health) => {
        }
    })
}
