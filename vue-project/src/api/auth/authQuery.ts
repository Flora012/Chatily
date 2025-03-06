import axiosClient from "@/lib/axios"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { useRoute, useRouter } from "vue-router"
import type { ForgottenPasswordParam, ForgottenSetPasswordParam, LoginParam, RegistrationData, RegistrationResponse, SetPasswordResponse, User } from "./auth"
import { QUERY_KEYS } from "@/utils/queryKeys"

// A regisztrációs adatokat küldjük el a backend-nek
const registration = async (data: RegistrationData): Promise<RegistrationResponse> => {
    try {
        const response = await axiosClient.post("http://localhost:3000/user/", data);
        console.log(response.data.data);
        response.data.data = data.email, data.firstname,data.lastname, data.password, data.phoneNumber;
        return response.data.data;  
    } catch (error: any) {
        console.error("Regisztrációs hiba:", error.response?.data?.error);
        throw new Error(error.response?.data?.error || "Regisztráció sikertelen!");
    }
};

export const useRegistration = () => {
    const { push } = useRouter();
    return useMutation({
        mutationFn: registration,
        onSuccess(data) {
            
            push(`/login`);

        },
        onError(error: any) {
            console.log("Regisztráció sikertelen:", error.message);
            throw new Error(error.message);  // Tovább dobjuk a hibaüzenetet
        },
    });
};

const fetchCurrentUser = async (): Promise<User> => {
    const response = await axiosClient.get("http://localhost:3000/me");
    return response.data;
};

export const useCurrentUser = () => {
    return useQuery({
        queryKey: ["currentUser"],
        queryFn: fetchCurrentUser,
        staleTime: 1000 * 60 * 5, // 5 percig friss marad
        retry: false
    });
};


const login = async (data: LoginParam): Promise<RegistrationResponse> => {
    const response = await axiosClient.post("http://localhost:3000/login", data)
    return response.data.data
}

export const useLogin = () => {
    const { push } = useRouter();
    return useMutation({
        mutationFn: login,
        onSuccess(data) {
            localStorage.setItem("token", data.token); // Token mentése
            localStorage.setItem("user", JSON.stringify(data)); // Felhasználói adatok mentése
            push({ name: 'home' });
        },
        onError(error: any) {
            throw new Error(error.response?.data?.error || "Bejelentkezés sikertelen!");
        }
    });
};


const postForgottenPassword = async (data: ForgottenPasswordParam) => {
    const response = await axiosClient.post(`http://localhost:5173/`, data)
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

