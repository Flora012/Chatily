import axiosClient from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/vue-query";
import { useRoute, useRouter } from "vue-router";
import type {
  ForgottenPasswordParam,
  ForgottenSetPasswordParam,
  LoginParam,
  RegistrationData,
  RegistrationResponse,
  SetPasswordResponse,
  User,

} from "./auth";

const registration = async (data: RegistrationData): Promise<RegistrationResponse> => {
  try {
    const response = await axiosClient.post("http://localhost:3000/auth", data); 
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Registration failed!");
  }
};

export const useRegistration = () => {
  const router = useRouter(); 
  return useMutation({
    mutationFn: registration,
    onSuccess: (data) => {
      
      router.push({ name: 'login' }); 
    },
    onError: (error: any) => {
      console.error("Registration failed:", error.message);

    },
  });
};




const fetchCurrentUser = async (): Promise<User> => {
  const response = await axiosClient.get("/me");
  return response.data;
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};

const login = async (data: LoginParam): Promise<RegistrationResponse> => {
  const response = await axiosClient.post("http://localhost:3000/user/", data);
  return response.data.data;
};

export const useLogin = () => {
  const { push } = useRouter();
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log(data)
      localStorage.setItem("userId", data.userId); 
      localStorage.setItem("userEmail", data.userEmail);
      console.log(localStorage.getItem("userId"))
      push({ name: "home" });
    },
    onError: (error: any) => {
      throw error.response?.data?.message || "Bejelentkezés sikertelen!"; 
    },
  });
};

const postForgottenPassword = async (data: ForgottenPasswordParam) => {
  const response = await axiosClient.post(`/`, data);
  return response.data;
};

export const usePostForgottenPassword = () => {
  const { push } = useRouter();
  return useMutation({
    mutationFn: postForgottenPassword,
    onSuccess: (data) => {
      
      push({ name: "set-forgotten-password", params: { token: data.data?.token } });
    },
  });
};

const getForgottenPassword = async (): Promise<SetPasswordResponse> => {
  const { params } = useRoute();
  const response = await axiosClient.get(`/password-reset/${params.token}`);
  return response.data;
};

export const useGetForgottenPassword = () => {
  return useQuery({
    queryKey: ["getForgottenPassword"],
    queryFn: getForgottenPassword,
  });
};


