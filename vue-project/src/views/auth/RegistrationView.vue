<script lang="ts" setup>
import type { RegistrationData } from '@/api/auth/auth';
import { useRegistration } from '@/api/auth/authQuery';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const registrationDataRef = ref<RegistrationData>({
    email: '',
    lastname: '',
    firstname: '',
    phoneNumber: '',
    password: '', // A jelszó mező// A jelszó megerősítése mező
    confirmPassword:'',
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
    const minLength = /.{8,}/;
    const hasUpperCase = /[A-Z]/;
    const hasSpecialChar = /[.]/;

    if (password !== confirmPassword) {
        passwordError.value = "A két jelszó nem egyezik!";
        return false;
    }
    else if (!minLength.test(password)) {
        passwordError.value = "A jelszónak legalább 8 karakter hosszúnak kell lennie."
        return false;
    }
    else if (!hasUpperCase.test(password)) {
        passwordError.value="A jelszónak tartalmaznia kell legalább egy nagybetűt."
        return false
    }
    else if (!hasSpecialChar.test(password)) {
        passwordError.value = "A jelszónak tartalmaznia kell legalább egy speciális karaktert, például '.'."
        return false
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
    const { ...registrationDataToSend } = registrationDataRef.value;

    // Ha minden rendben, regisztráljuk a felhasználót
    registration(registrationDataToSend, {
        onSuccess: (data) => {
            console.log("Sikeres regisztráció:", data);
            router.push({
                name: 'login',
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
  
    <div class="container">
      <v-card class="form-card">
        <v-card-title class="title">Regisztráció</v-card-title>
        <v-card-text>
          <v-text-field v-model="registrationDataRef.lastname" label="Vezetéknév" variant="outlined" class="input-field"></v-text-field>
          <v-text-field v-model="registrationDataRef.firstname" label="Keresztnév" variant="outlined" class="input-field"></v-text-field>
          <v-text-field v-model="registrationDataRef.email" label="Email" variant="outlined" class="input-field" :error-messages="emailError"></v-text-field>
          <v-text-field v-model="registrationDataRef.phoneNumber" label="Telefonszám" variant="outlined" class="input-field"></v-text-field>
          <v-text-field v-model="registrationDataRef.password" label="Jelszó" type="password" variant="outlined" class="input-field" :error-messages="passwordError"></v-text-field>
          <v-text-field v-model="registrationDataRef.confirmPassword" label="Jelszó megerősítése" type="password" variant="outlined" class="input-field" :error-messages="passwordError"></v-text-field>
          <v-alert v-if="registrationError" type="error" variant="outlined">{{ registrationError }}</v-alert>
        </v-card-text>
        <v-card-actions>
          <v-btn class="registrationButton"@click="handleRegistration" :loading="isPending">Regisztráció</v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </template>

  <style scoped>

  *{
    width: 500px;
  }
  body{
    background-color: #305551;
  }

  .v-text-field{
    margin-bottom: 2px;
  }

  .v-card-title title{
    background-color: aquamarine;
  }
  
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh; /* Teljes magasság kitöltése */
    background-color: #305551 ; /* Türkiz háttér */
    width: 100%;
  }
  
  .form-card {
    width: 100%;
    max-width: 1000px; 
    padding: 20px;
    border-radius: 12px;
    background: rgb(128, 195, 197);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  
  .input-field {
    width: 100%; 
    max-width: 4000px; 
    margin-bottom: 2px;
  }
</style>
  
  
