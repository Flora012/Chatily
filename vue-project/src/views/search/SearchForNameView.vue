<script lang="ts" setup>
import { ref } from 'vue';
import { useSearch } from '@/api/search/searchQuery';
import { useCurrentUser } from "@/api/user/useCurrentUser";
import axiosClient from "@/lib/axios"

interface User {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    profilePicture?: string;
}

interface UserFriend {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    profilePicture?: string;
    friend_Email: string;
}

const searchParam = ref({ param: '' });
const searchResults = ref<User[]>([]);
const searchError = ref<string | null>(null);
const selectedUsers = ref<UserFriend[]>([]);

const { mutate: search, isPending } = useSearch();
const { data: currentUser } = useCurrentUser(); // 🔹 Bejelentkezett felhasználó lekérése

const handleSearch = async () => {
    searchError.value = null;

    if (searchParam.value.param.length < 3) {
        searchError.value = "Legalább 3 karaktert meg kell adni a kereséshez.";
        return;
    }

    search(searchParam.value, {
        onSuccess: (data: UserFriend[]) => {
            const loggedInEmail = localStorage.getItem('userEmail'); // 🔹 Email lekérése localStorage-ból
            if (loggedInEmail) {
                searchResults.value = data.filter((user: User) => user.email !== loggedInEmail);
            } else {
                searchResults.value = data;
            }
        },
        onError: (error: any) => {
            searchError.value = error.response?.data?.error || "Hiba történt a keresés során.";
        }
    });
};

const selectUser = async (user: User) => {
    const loggedInEmail = localStorage.getItem('userEmail');

    if (!loggedInEmail) {
        console.error("Nincs bejelentkezett felhasználó!");
        return;
    }

    const userFriend: UserFriend = {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        profilePicture: user.profilePicture,
        friend_Email: loggedInEmail, // 🔹 A bejelentkezett felhasználó emailje
    };

    if (!selectedUsers.value.some(u => u.email === user.email)) {
        selectedUsers.value.push(userFriend);
    }

    try {
        const response = await axiosClient.post("http://localhost:3000/notify", userFriend);
        console.log("Sikeres értesítés:", response.data);
        return response.data;
    } catch (error) {
        console.error("Email értesítés hiba:", error);
    }
};
</script>

<template>
  <div class="container">
    <v-icon>mdi-plus</v-icon>
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
        <v-btn icon @click="selectUser(user)" style="display: flex; background: white;">
          <div class="friend-placeholder">+</div>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<style scoped>
.friend-placeholder {
  font-size: 20px;
}
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
  justify-content: space-between;
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
  width: 40% !important;
}
</style>
