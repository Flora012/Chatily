<script lang="ts" setup>
import type { RegistrationData } from '@/api/auth/auth';
import { useRegistration } from '@/api/auth/authQuery';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const registrationDataRef = ref<RegistrationData>({
    name: '',
    email: '',
    lastname: '',
    firstname: '',
    phoneNumber: '',
    password: '', // A jelszó mező
    confirmPassword: '', // A jelszó megerősítése mező
});

const emailError = ref<string | null>(null);
const passwordError = ref<string | null>(null);
const registrationError = ref<string | null>(null);

const validateEmail = (email: string): boolean => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
};

// Ellenőrizzük, hogy a jelszavak megegyeznek-e
const validatePasswords = (password: string, confirmPassword: string): boolean => {
    if (password !== confirmPassword) {
        passwordError.value = "A két jelszó nem egyezik!";
        return false;
    }
    return true;
};

const { mutate: registration, isPending } = useRegistration();

const handleRegistration = () => {
    emailError.value = null;
    passwordError.value = null;
    registrationError.value = null;

    // Ellenőrizzük az e-mail érvényességét
    if (!validateEmail(registrationDataRef.value.email)) {
        console.log("iqkebvnéqv")
        emailError.value = "Érvénytelen e-mail cím!";
        return;
    }

    // Ellenőrizzük, hogy a két jelszó megegyezik-e
    if (!validatePasswords(registrationDataRef.value.password, registrationDataRef.value.confirmPassword)) {
        return;
    }

    // Töröljük a "Jelszó megerősítése" mezőt, mert azt nem küldjük el
    const { confirmPassword, ...registrationDataToSend } = registrationDataRef.value;

    // Ha minden rendben, regisztráljuk a felhasználót
    registration(registrationDataToSend, {
        onSuccess: (data) => {
            console.log("Sikeres regisztráció:", data);
            router.push({
                name: 'set-password',
                params: { token: data.token, userid: data.userid },
            });
        },
        onError: (error: any) => {
            if (error.response?.data?.error) {
                registrationError.value = error.response.data.error;
            } else {
                registrationError.value = "Ez az e-mail cím vagy telefonszám már használatban van! ";
            }
        }
    });
};

</script>

<template>
    <v-card>
        <v-card-title>Regisztráció</v-card-title>
        <v-card-text>
            <v-text-field v-model="registrationDataRef.lastname" label="Vezetéknév" variant="outlined"></v-text-field>
            <v-text-field v-model="registrationDataRef.firstname" label="Keresztnév" variant="outlined"></v-text-field>
            <v-text-field 
                v-model="registrationDataRef.email" 
                label="Email" 
                variant="outlined"
                :error-messages="emailError"
            ></v-text-field>
            <v-text-field v-model="registrationDataRef.phoneNumber" label="Telefonszám" variant="outlined"></v-text-field>

            <!-- Jelszó mező -->
            <v-text-field 
                v-model="registrationDataRef.password" 
                label="Jelszó" 
                type="password" 
                variant="outlined" 
                :error-messages="passwordError"
            ></v-text-field>

            <!-- Jelszó megerősítése mező -->
            <v-text-field 
                v-model="registrationDataRef.confirmPassword" 
                label="Jelszó megerősítése" 
                type="password" 
                variant="outlined" 
                :error-messages="passwordError"
            ></v-text-field>

            <v-alert v-if="registrationError" type="error" variant="outlined">
                {{ registrationError }}
            </v-alert>
        </v-card-text>
        <v-card-actions>
            <v-btn @click="handleRegistration" :loading="isPending">
                Regisztráció
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
