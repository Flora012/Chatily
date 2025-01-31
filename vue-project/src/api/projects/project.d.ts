export type Project = {
    id: number,
    name: string,
    created_by: {
        id: number,
        name: string
    }
}


export type ProjectCreateParam = {
    name: string
}

export type ProjectUpdateParam = {
    name: string
}