<template>
  <div class="search-page">
    <v-container>
      <v-text-field
        v-model="searchQuery"
        label="Keresés..."
        variant="outlined"
        rounded
        clearable
        class="search-bar"
      ></v-text-field>

      <v-list v-if="filteredUsers.length">
        <v-list-item v-for="user in filteredUsers" :key="user.id">
          <v-avatar size="40">
            <v-img v-if="user.profilePicture" :src="user.profilePicture"></v-img>
            <v-avatar v-else color="grey darken-1"></v-avatar>
          </v-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ user.firstname }} {{ user.lastname }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <p v-else-if="searchQuery.length >= 3">Nincs találat.</p>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useSearchQuery } from "@/api/search/searchQuery";

const searchQuery = ref("");
const { data } = useSearchQuery(searchQuery); // ✅ HOOK ITT HASZNÁLVA

const filteredUsers = computed(() => data.value || []); // 🔹 Automatikusan frissül
</script>

<style scoped>
.search-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 50px;
  width: 100%;
  max-width: 1000px;
  text-align: center;
  margin-left: 20px;
}

.search-bar {
  width: 100%;
  background: white;
  border-radius: 25px;
}
</style>
