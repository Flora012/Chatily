<script lang="ts" setup>
import { ref } from 'vue';
import { useSearch } from '@/api/search/searchQuery';

const searchParam = ref({ param: '' });
const searchResults = ref<any[]>([]);
const searchError = ref<string | null>(null);

const { mutate: search, isPending } = useSearch();

const handleSearch = async () => {
  searchError.value = null;
  searchResults.value = [];

  if (searchParam.value.param.length < 3) {
    searchError.value = 'Legalább 3 karaktert meg kell adni a kereséshez.';
    return;
  }

  search(searchParam.value, {
    onSuccess: (data) => {
      searchResults.value = data;  // A 'users' tömb beállítása
    },
    onError: (error: any) => {
      searchError.value = error.message;
    }
  });
};
</script>

<template>
  <div class="container">
    <v-text-field
      v-model="searchParam.param"
      label="Keresés név alapján"
      variant="outlined"
      class="input-field"
    />
    <v-btn color="info" variant="elevated" @click="handleSearch" :loading="isPending">
      Keresés
    </v-btn>

    <v-alert v-if="searchError" type="error" variant="outlined" class="mt-3">
      {{ searchError }}
    </v-alert>

    <div class="results">
      <div v-for="user in searchResults" :key="user.id" class="user-card">
        <img v-if="user.profilePicture" :src="user.profilePicture" alt="Profilkép" class="profile-pic">
        <div v-else class="profile-placeholder">?</div>
        <span class="user-name">{{ user.firstname }} {{ user.lastname }}</span>
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
  width: 100% !important;
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
.user-name {
  font-weight: bold;
}
</style>
