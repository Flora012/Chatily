export type RegistrationData = {
    lastname: string,
    firstname: string,
    email: string,
    password: string,
    phoneNumber: string,
    confirmPassword:string,
}

export type RegistrationResponse = {
    userid: string,
    token: string,
    email:string,
}

export type User = {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    profilePicture?: string;
};


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
