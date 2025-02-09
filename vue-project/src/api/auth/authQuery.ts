import axiosClient from "@/lib/axios"
import type { ForgottenPasswordParam, ForgottenSetPasswordParam, LoginParam, RegistrationData, RegistrationResponse, SetPasswordData, SetPasswordResponse } from "./auth"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { useRoute, useRouter } from "vue-router"
import { QUERY_KEYS } from "@/utils/queryKeys"

// A regisztrációs adatokat küldjük el a backend-nek
const registration = async (data: RegistrationData): Promise<RegistrationResponse> => {
    const response = await axiosClient.post("http://localhost:5173/registration", data);
    console.log({response})
    return response.data.data;  // Visszaadjuk a választ
}

export const useRegistration = () => {
    const { push } = useRouter();
    return useMutation({
        mutationFn: registration,
        onSuccess(data) {
            push({ name: 'set-password', params: { token: data.token } }); // Ha sikeres, átirányítunk
        },
        onError(error:any){
            console.log(error)
            throw new Error(error.response.data.error)
        },
        
    });
};


const getSetPassword = async (): Promise<SetPasswordResponse> => {
    const {params} = useRoute()
    const response = await axiosClient.get(`http://172.22.1.219/api/v1/set-password/${params.token}`)
    return response.data
}

export const useGetSetPassword = () => {
    return useQuery(
        {
            queryKey: [QUERY_KEYS.setPassword],
            queryFn: getSetPassword,
        }
    )
}

const putSetPassword = async (token: string, data: SetPasswordData) => {
    const response = await axiosClient.put(`http://172.22.1.219/api/v1/set-password/${token}`, data)
    return response.data
}

export const usePutSetPassword = () => {

    return useMutation(
        {
            mutationFn: ({token, data} : { token: string, data: SetPasswordData }) => putSetPassword(token, data),
        }
    )
}


const postForgottenPassword = async (data: ForgottenPasswordParam) => {
    const response = await axiosClient.post(`http://172.22.1.219/api/v1/password-reset`, data)
    return response.data
}

export const usePostForgottenPassword = () => {
    const {push} = useRouter();
    return useMutation({
        mutationFn: postForgottenPassword,
        onSuccess(data) {
            console.log(data)
            push({name: 'set-forgotten-password', params: {token: data.data?.token}})
        },
    })
}

const getForgottenPassword = async (): Promise<SetPasswordResponse> => {
    const {params} = useRoute()
    const response = await axiosClient.get(`http://172.22.1.219/api/v1/password-reset/${params.token}`)
    return response.data
}

export const useGetForgottenPassword = () => {
    return useQuery(
        {
            queryKey: ["getForgottenPassword"],
            queryFn: getForgottenPassword,
        }
    )
}


const putForgottenPassword = async (token: string, data: ForgottenSetPasswordParam) => {
    const response = await axiosClient.put(`http://172.22.1.219/api/v1/password-reset/${token}`, data)
    return response.data
}

export const usePutForgottenPassword = () => {

    return useMutation(
        {
            mutationFn: ({token, data} : { token: string, data: ForgottenSetPasswordParam }) => putForgottenPassword(token, data),
        }
    )
}


const login = async (data: LoginParam): Promise<RegistrationResponse> => {
    const response = await axiosClient.post("http://172.22.1.219/api/v1/login", data)
    return response.data.data
}

export const useLogin = () => {
    const {push} = useRouter()
    return useMutation({
        mutationFn: login,
        onSuccess(data) {
            localStorage.setItem("login", JSON.stringify(data))
            push({name: 'profile'})
        },
    })
}