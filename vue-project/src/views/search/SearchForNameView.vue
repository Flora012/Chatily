<script lang="ts" setup>
import { ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import axios from 'axios';

const searchQuery = ref('');
const searchResults = ref<any[]>([]);
const searchError = ref<string | null>(null);
const isLoading = ref(false);

const handleSearch = async () => {
  searchError.value = null;
  searchResults.value = [];
  
  if (searchQuery.value.length < 3) {
    searchError.value = 'Legalább 3 karaktert meg kell adni a kereséshez.';
    return;
  }
  
  isLoading.value = true;
  try {
    const response = await axios.get(`http://localhost:3000/api/users/search?query=${searchQuery.value}`);
    
    if (response.data.message) {
      searchError.value = response.data.message;
    } else {
      searchResults.value = response.data;
    }
  } catch (error) {
    searchError.value = 'Hiba történt a keresés során.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="container">
    <v-text-field v-model="searchQuery" label="Keresés név alapján" variant="outlined" class="input-field"></v-text-field>
    <v-btn color="info" variant="elevated" @click="handleSearch" :loading="isLoading">
      Keresés
    </v-btn>
    
    <v-alert v-if="searchError" type="error" variant="outlined" class="mt-3">
      {{ searchError }}
    </v-alert>
    
    <div v-if="searchResults.length" class="results">
      <div v-for="user in searchResults" :key="user.id" class="user-card">
        <img v-if="user.profilePicture" :src="user.profilePicture" alt="Profilkép" class="profile-pic" />
        <div v-else class="profile-placeholder">&#9679;</div>
        <span>{{ user.firstname }} {{ user.lastname }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  margin: auto;
}
.input-field {
  width: 100%;
  margin-bottom: 10px;
}
.results {
  width: 100%;
  margin-top: 10px;
}
.user-card {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 5px;
}
.profile-pic {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}
.profile-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: gray;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  margin-right: 10px;
}
</style>
