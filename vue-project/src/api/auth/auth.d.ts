export type RegistrationData = {
    lastname: string,
    firstname: string,
    email: string,
    password: string,
    phoneNumber: string,
}

export type RegistrationResponse = {
    userid: string,
    token: string
}

export type SetPasswordResponse = {
    status: string,
    data: []
}

export type SetPasswordData = {
    password: string,
    password_confirmation: string,
}


export type LoginParam = {
    email: string,
    password: string
}

export type ForgottenPasswordParam = {
    email: string,
}


export type ForgottenSetPasswordParam = {
    password: string,
    password_confirmation: string,
}
