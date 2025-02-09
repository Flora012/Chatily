<script lang="ts" setup>
import type { RegistrationData } from '@/api/auth/auth';
import { useRegistration } from '@/api/auth/authQuery';
import { ref } from 'vue';

const registrationDataRef = ref<RegistrationData>({
    name: '',
    email: '',
    lastname: '',
    firstname: '',
    password: '',
    passwordAgain: '',
    phoneNumber: '',
})

const { mutate: registration, isPending} = useRegistration()

</script>
<template>
    <v-card>
        <v-card-title>Regisztráció</v-card-title>
        <v-card-text>
            <v-text-field v-model="registrationDataRef.lastname" label="Vezetéknév" variant="outlined"></v-text-field>
            <v-text-field v-model="registrationDataRef.firstname" label="Keresztnév" variant="outlined"></v-text-field>
            <v-text-field v-model="registrationDataRef.email" label="Email" variant="outlined"></v-text-field>
            <v-text-field v-model="registrationDataRef.password" label="Jelszó" variant="outlined"></v-text-field>
            <v-text-field v-model="registrationDataRef.passwordAgain" label="Jelszó mégegyszer" variant="outlined"></v-text-field>
            <v-text-field v-model="registrationDataRef.phoneNumber" label="Telefonszám" variant="outlined"></v-text-field>
        </v-card-text>
        <v-card-actions>
            <v-btn @click="() => {
                registration(registrationDataRef)
            }" :loading="isPending">
                Regisztráció
            </v-btn>
        </v-card-actions>
    </v-card>
</template>