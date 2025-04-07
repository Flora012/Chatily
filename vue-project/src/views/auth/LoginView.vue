<template>
    <div class="container">
      <v-card class="form-card">
        <v-card-title class="title">Belépés</v-card-title>
        <v-card-text class="vcardtext-inputs">
          <v-text-field v-model="loginParam.email" label="Email" variant="outlined" class="input-field" :error-messages="emailError"></v-text-field>
          <v-text-field v-model="loginParam.password" label="Jelszó" type="password" variant="outlined" class="input-field" :error-messages="passwordError"></v-text-field>
          <v-alert v-if="loginError" type="error" variant="outlined">{{ loginError }}</v-alert>
        </v-card-text>
        <v-card-actions class="actions">
          <v-btn color="#8e39ac" variant="elevated" @click="handleLogin" :loading="isPending" class="login-btn">
            Belépés
          </v-btn>
          <v-btn @click="openResetPasswordDialog" class="forgotten-password-btn">Elfelejtett jelszó</v-btn>
        </v-card-actions>
        <div class="registration-link">
          Nincs még fiókod? <span class="link" @click="router.push({ name: 'registration' })">Regisztrálj itt.</span>
        </div>
      </v-card>
      <v-dialog v-model="isResetPasswordDialogOpen" max-width="500" class="reset-password-dialog">
        <v-card class="form-card">
          <v-card-title class="title-forgot">Jelszó visszaállítása</v-card-title>
          <v-card-text>
            <v-text-field v-model="resetEmail" class="forgotten-password-input-field" label="Email cím" type="email" required :error-messages="resetEmailError"></v-text-field>
            <div v-if="resetSuccess" class="success-message">Email elküldve!</div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn id="back-button" @click="closeResetPasswordDialog">Mégse</v-btn>
            <v-btn color="#8e39ac" variant="elevated" id="send-button" @click="handleResetPassword">Küldés</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  import type { LoginParam } from '@/api/auth/auth';
  import { useLogin } from '@/api/auth/authQuery';
  import type { LoggedInUser } from '@/api/notifications/notifications';
  
  const loggedInUser = ref<LoggedInUser>({ email: '' });
  const router = useRouter();
  const loginParam = ref<LoginParam>({ email: '', password: '' });
  const emailError = ref<string | null>(null);
  const passwordError = ref<string | null>(null);
  const loginError = ref<string | null>(null);
  const isResetPasswordDialogOpen = ref(false);
  const resetEmail = ref('');
  const resetEmailError = ref<string | null>(null);
  const resetSuccess = ref(false);
  const realVerificationCode = ref<string | null>(null);
  
  
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
      onSuccess: (response) => {
        loggedInUser.value.email = loginParam.value.email;
        router.push({ name: 'home' });
        location.reload();
      },
      onError: (error: any) => {
        loginError.value = error.response?.data?.error || "Hibás bejelentkezési adatok!";
      },
    });
  };
  
  const openResetPasswordDialog = () => {
    isResetPasswordDialogOpen.value = true;
    resetEmailError.value = null;
    resetEmail.value = '';
    resetSuccess.value = false;
  };
  
  const closeResetPasswordDialog = () => {
    isResetPasswordDialogOpen.value = false;
    resetEmailError.value = null;
    resetEmail.value = '';
    resetSuccess.value = false;
  };
  
  const handleResetPassword = async () => {
    resetEmailError.value = null;

    if (!validateEmail(resetEmail.value)) {
        resetEmailError.value = "Érvénytelen e-mail cím!";
        return;
    }
    try {
        const response = await axios.post('http://localhost:3000/user/checkEmailExists', { email: resetEmail.value });

        if (!response.data.exists) {
            resetEmailError.value = 'Nincs ilyen e-mail cím regisztrálva';

        } else {
            
            try {
                const codeResponse = await axios.post(`http://localhost:3000/user/sendForgottenPasswordEmail/${resetEmail.value}`);
                realVerificationCode.value = codeResponse.data;
                resetSuccess.value = true; 
                setTimeout(closeResetPasswordDialog, 3000); 
            } catch (codeError: any) {
                resetEmailError.value = codeError.response?.data?.error || 'Hiba történt a kód küldése közben.';
                return;
            }
        }
    } catch (error) {
        console.error('Hiba az email ellenőrzése közben:', error);
        resetEmailError.value = 'Hiba történt az e-mail ellenőrzése közben. Kérjük, próbáld újra.';
    }
  
  };
  </script>
  
  <style scoped>

  #back-button{
    background-color: #c48cd9;
    border: 1px solid black;
  }
  #send-button{
    border: 1px solid black;
  }
  
  .title-forgot{
    font-weight: bold;
    font-size: 1.3rem;
    color: white;

  }

  .form-card{
    background-color: #bb79d2;

  }

  .forgotten-password-input-field:deep(.v-input__control) {
    background-color: #d8b3e6 !important;
    width: 100%;
    border-radius: 8px;
    border: 1px solid black;
  }
  .reset-password-dialog{
    font-family: 'Lucida Console', monospace; 
    background-color: #e2c6ec;
    justify-content: center;
    align-items: center;

  }
  .actions{
    justify-content: center;
    
  }

  .vcardtext-inputs{
    align-items: center;
    justify-content: center;
  }

  .input-field :deep(.v-input__control) {
    background-color: #d8b3e6 !important;
    width: 100%;
    border-radius: 8px;
    border: 1px solid black;
  }
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #e2c6ec; 
    width: 100%;
  }
  
  .form-card {
    margin-top: -10%;
    width: 100%;
    max-width: 400px;
    padding: 30px;
    border-radius: 12px;
    background: #bb79d2;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    text-align: center;
    border: 10px solid #d8b3e6; 
    animation: border-animation 6s linear infinite; 
}
  
@keyframes border-animation {
  0% { border-color: #d8b3e6; }
  5% { border-color: #ce9fdf; }
  10% { border-color: #c48cd9; }
  15% { border-color: #b166cc; }
  20% { border-color: #a753c6; }
  25% { border-color: #9d40bf; }
  30% { border-color: #8e39ac; }
  35% { border-color: #7e3399; }
  40%{border-color: #6e2d86;}
  45% { border-color: #5e2673;}
  50%{border-color: #6e2d86;}
  55% { border-color: #7e3399; }
  60% { border-color: #8e39ac; }
  65% { border-color: #9d40bf; }
  70% { border-color: #a753c6; }
  75% { border-color: #b166cc; }
  80% { border-color: #c48cd9; }
  85% { border-color: #ce9fdf; }
  100% { border-color: #d8b3e6; }
  
  

}

.login-btn {
    border: 1px solid black;
  }
  
  .title {
    text-align: center;
    font-size: 1.5rem;
    margin-bottom: 20px;
    font-family: 'Lucida Console', monospace; 
    font-weight: bold;
    color:white;

  }
  .forgotten-password-btn{
    background-color: #c48cd9;
    border: 1px solid black;
    color: white;
    font-family: 'Lucida Console', monospace; 

  }
  
  .input-field {
    width: 100% ;
    margin-bottom: 15px;
    border-radius: 8px;
    font-family: 'Lucida Console', monospace; 


  }
  
  .actions {
    justify-content: center;
  }
  
  .registration-link {
  margin-top: 20px;
  font-size: 1rem;
  text-align: center;
  font-family: 'Lucida Console', monospace; 
  font-weight: bold;
  color: white;
}

  
  .link {
    color: #4f2060;
    cursor: pointer;
    text-decoration: underline;
    font-weight: bold;
  }
  
  .success-message {
    color: green;
    margin-top: 10px;
    font-family: 'Lucida Console', monospace; 
    font-weight: bold;

  }
  </style>
  