<template>
  <div class="container">
    <v-card class="form-card">
      <v-card-title class="title">Jelszó visszaállítás</v-card-title>
      <v-card-text class="card-text">
        <v-text-field v-model="newPassword" label="Új jelszó" type="password" variant="outlined" class="input-field" :error-messages="passwordError" required></v-text-field>
        <v-text-field v-model="confirmPassword" label="Jelszó megerősítése" type="password" variant="outlined" class="input-field" :error-messages="passwordError" required></v-text-field>
        <v-alert v-if="passwordError" type="error" variant="outlined">{{ passwordError }}</v-alert>
        <v-alert v-if="successMessage" type="success" variant="outlined">{{ successMessage }}</v-alert>
        <v-alert v-if="errorMessage" type="error" variant="outlined">{{ errorMessage }}</v-alert>
      </v-card-text>
      <v-card-actions class="actions">
        <v-btn color="#8e39ac" variant="elevated" class="reset-button" @click="resetPassword">
          Jelszó visszaállítása
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import { ref, computed } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const route = useRoute();
    const newPassword = ref('');
    const confirmPassword = ref('');
    const passwordError = ref<string | null>(null);
    const successMessage = ref<string | null>(null);
    const errorMessage = ref<string | null>(null);
    const emailHash = computed(() => route.params.emailHash as string); 

    const resetPassword = async () => {
      passwordError.value = null;
      successMessage.value = null;
      errorMessage.value = null;

      if (!validatePasswords(newPassword.value, confirmPassword.value)) {
        return;
      }

      try {
        const response = await axios.post('http://localhost:3000/user/reset-password', { 
          emailhash: emailHash.value,
          newPassword: newPassword.value,
        });
        successMessage.value = response.data.message || "Jelszó sikeresen visszaállítva!";
        router.push('/login');
      } catch (error: any) {
        errorMessage.value = error.response?.data?.error || "Hiba történt a jelszó visszaállításakor. Kérjük, próbáld újra!";
      }
    };

    const validatePasswords = (password: string, confirmPassword: string): boolean => {
      const minLength = /.{8,}/;
      const hasUpperCase = /[A-Z]/;

      if (password !== confirmPassword) {
        passwordError.value = "A két jelszó nem egyezik!";
        return false;
      } else if (!minLength.test(password)) {
        passwordError.value = "A jelszónak legalább 8 karakter hosszúnak kell lennie.";
        return false;
      } else if (!hasUpperCase.test(password)) {
        passwordError.value = "A jelszónak tartalmaznia kell legalább egy nagybetűt.";
        return false;
      }
      return true;
    };

    return {
      newPassword,
      confirmPassword,
      passwordError,
      resetPassword,
      successMessage,
      errorMessage,
      emailHash,
    };
  },
};
</script>
<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  width: 50%;  
  background-color: #e2c6ec; 
  border-radius: 22px;
  font-family: 'Lucida Console', monospace; 
}

.form-card {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #bb79d2;
  border: 10px solid #d8b3e6; 
  animation: border-animation 6s linear infinite; 
}

.input-field :deep(.v-input__control) {
    background-color: #d8b3e6 !important;
    width: 100%;
    border-radius: 8px;
    border: 1px solid black;
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

.title {
  text-align: center;
  font-size: 1.3rem;
  margin-bottom: 20px;
  font-weight: bold;
  color: white;
}



.input-field {
  width: calc(100% - 24px); 
  margin-bottom: 15px;
  border-radius: 100px;
  margin-left: 10px;
}

.actions {
  justify-content: center; 
}

.reset-button {
  border-radius: 8px; 
  font-weight: bold;
  border: 1px solid black;
}
</style>
