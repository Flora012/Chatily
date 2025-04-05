<template>
    <div>
      <input type="password" v-model="newPassword" placeholder="Új jelszó">
      <button @click="resetPassword">Jelszó frissítése</button>
      <div v-if="errorMessage">{{ errorMessage }}</div>
      <div v-if="successMessage">{{ successMessage }}</div>
    </div>
  </template>
  
  <script lang="ts">
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useRoute } from 'vue-router';
  
  export default {
    setup() {
    localStorage.setItem('userId', '0'); 
      const route = useRoute();
      const token = route.params.token as string;
      const newPassword = ref('');
      const errorMessage = ref('');
      const successMessage = ref('');
  
      const resetPassword = async () => {
        errorMessage.value = '';
        successMessage.value = '';
  
        try {
          const response = await axios.post(`/api/users/reset-password/${token}`, { newPassword: newPassword.value }); 
          successMessage.value = response.data.message;
        } catch (error: any) {
          errorMessage.value = error.response?.data?.error || 'Hiba történt.';
        }
      };
  
      return { newPassword, resetPassword, errorMessage, successMessage };
    },
  };
  </script>
  