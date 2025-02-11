<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type { LoginParam } from '@/api/auth/auth';
import { useLogin } from '@/api/auth/authQuery';

const router = useRouter();
const loginParam = ref<LoginParam>({
    email: '',
    password: ''
});

const emailError = ref<string | null>(null);
const passwordError = ref<string | null>(null);
const loginError = ref<string | null>(null);

const validateEmail = (email: string): boolean => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
};

const { mutate: login, isPending } = useLogin();

const handleLogin = () => {
    emailError.value = null;
    passwordError.value = null;
    loginError.value = null;

    if (!validateEmail(loginParam.value.email)) {
        emailError.value = "Érvénytelen e-mail cím!";
        return;
    }

    if (!loginParam.value.password) {
        passwordError.value = "A jelszó nem lehet üres!";
        return;
    }

    login(loginParam.value, {
        onSuccess: () => {
            router.push({ name: 'dashboard' });
        },
        onError: (error: any) => {
            loginError.value = error.response?.data?.error || "Hibás bejelentkezési adatok!";
        }
    });
};
</script>

<template>
    <div class="container">
        <v-card class="form-card">
            <v-card-title>Belépés</v-card-title>
            <v-card-text>
                <v-text-field v-model="loginParam.email" label="Email" variant="outlined" class="input-field" :error-messages="emailError"></v-text-field>
                <v-text-field v-model="loginParam.password" label="Jelszó" variant="outlined" type="password" class="input-field" :error-messages="passwordError"></v-text-field>
                <v-alert v-if="loginError" type="error" variant="outlined">{{ loginError }}</v-alert>
            </v-card-text>
            <v-card-actions>
                <v-btn color="info" variant="elevated" @click="handleLogin" :loading="isPending">
                    Belépés
                </v-btn>
                <v-btn @click="router.push({name: 'forgotten-password'})">
                    Elfelejtett jelszó
                </v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<style scoped>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #305551;
    width: 100%;
  }
  .form-card {
    width: 100%;
    max-width: 400px;
    padding: 20px;
    border-radius: 12px;
    background: rgb(128, 195, 197);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  .input-field {
    width: 100%;
    margin-bottom: 10px;
  }
</style>
