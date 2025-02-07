import axiosClient from "@/lib/axios"
import { useMutation, useQuery } from "@tanstack/vue-query"
import type { Project, ProjectCreateParam, ProjectUpdateParam } from "./project"
import { useRoute, useRouter } from "vue-router"
import queryClient from "@/lib/queryClient"
import type { LargeNumberLike } from "crypto"

const getProject = async (): Promise<Project> => {
    const loginToken = JSON.parse(localStorage.getItem("login") ?? "")
    let token = ""
    if(loginToken && loginToken?.token){
        token = String(loginToken.token)
    }
    const response = await axiosClient.get(`http://172.22.1.219/api/v1/projects`, {
        headers: {
            Authorization: "Bearer " + token
        }
    }
    )
    return response.data.data
}

export const useGetProject = () => {
    return useQuery(
        {
            queryKey: ["getProject"],
            queryFn: getProject,
            staleTime: Infinity
        }
    )
}

const postProject = async (data: ProjectCreateParam) => {
    const loginToken = JSON.parse(localStorage.getItem("login") ?? "")
    let token = ""
    if(loginToken && loginToken?.token){
        token = String(loginToken.token)
    }
    const response = await axiosClient.post(`http://172.22.1.219/api/v1/projects`,data, {
        headers: {
            Authorization: "Bearer " + token
        }
    }
    )
    return response.data
}


export const usePostProject = () =>{
    const {push} = useRouter()
    return useMutation(
        {
            mutationFn: postProject,
            onSuccess(data) {
                queryClient.refetchQueries({queryKey: ["getProject"]})
                push({name: 'projects'})
            },
        }
    )
}

const deleteProject = async (id: number) => {
    const loginToken = JSON.parse(localStorage.getItem("login") ?? "")
    let token = ""
    if(loginToken && loginToken?.token){
        token = String(loginToken.token)
    }
    const response = await axiosClient.delete(`http://172.22.1.219/api/v1/projects/${id}`, {
        headers: {
            Authorization: "Bearer " + token
        }
    }
    )
    return response.data
}

export const useDeleteProject = () =>{
    return useMutation(
        {
            mutationFn: deleteProject,
            onSuccess(data) {
                queryClient.refetchQueries({queryKey: ["getProject"]})
            },
        }
    )
}


const showProject = async () => {
    const {params} = useRoute()
    const loginToken = JSON.parse(localStorage.getItem("login") ?? "")
    let token = ""
    if(loginToken && loginToken?.token){
        token = String(loginToken.token)
    }
    const response = await axiosClient.get(`http://172.22.1.219/api/v1/projects/${params.id}`, {
        headers: {
            Authorization: "Bearer " + token
        }
    }
    )
    return response.data
}

export const useShowProject = () =>{
    return useQuery(
        {
            queryKey: ["project"],
            queryFn: showProject,
            staleTime:0,
        }
    )
}

const putProject = async (id: number, data: ProjectUpdateParam) => {
    const response = await axiosClient.put(`http://172.22.1.219/api/v1/set-password/${id}`, data)
    return response.data
}

export const usePutProject= () => {

    const {push} = useRouter()
    return useMutation(
        {
            mutationFn: ({id, data} : { id: number, data: ProjectUpdateParam }) => putProject(id, data),
            onSuccess(data){
                push({name:'projects'})
            },
        }
    )
}