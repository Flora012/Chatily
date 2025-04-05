<template>
  <div class="search-view">
    <div class="main-content">
      <v-card class="form-card">
        <v-card-text>
          <div class="container">
            <v-icon>mdi-plus</v-icon>
            <v-text-field
              v-model="searchParam.param"
              label="Keresés név alapján"
              variant="outlined"
              class="input-field"
            />
            <v-btn
              color="#8e39ac"
              variant="elevated"
              @click="handleSearch"
              :loading="isPending"
              class="search-button"
            >
              Keresés
            </v-btn>

            <v-alert
              v-if="searchError"
              type="error"
              variant="outlined"
              class="mt-3"
            >
              {{ searchError }}
            </v-alert>

            <div class="results">
              <div
                v-for="user in searchResults"
                :key="user.id"
                class="user-card"
              >
                <div class="profile-container">
                  <img
                    v-if="user.profilePicture"
                    :src="getProfilePictureUrl(user.profilePicture)"
                    class="profile-pic"
                    @error="handleImageError($event)"
                  />
                  <div v-else class="profile-placeholder">?</div>
                </div>
                <span class="user-name">{{ user.firstname }} {{ user.lastname }}</span>
                <span class="error-message" v-if="user.notificationError">{{ user.notificationError }}</span>
                <v-btn
                  icon
                  @click="selectUser(user)"
                  style="display: flex; background: white"
                >
                  <div class="friend-placeholder">+</div>
                </v-btn>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useSearch } from '@/api/search/searchQuery';
import type { User as UserType } from '@/api/search/search';
import axiosClient from '@/lib/axios';


const loggedInUser = localStorage.getItem('userEmail');

interface User extends UserType {
  notificationError?: string;
}

interface UserFriend {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  profilePicture?: string;
  loggedInUser: string;
}

interface SearchParams {
  param: string;
  loggedInUser: string;
}

const router = useRouter();

const searchParam = ref<SearchParams>({ param: '', loggedInUser: '' });
const searchResults = ref<User[]>([]);
const searchError = ref<string | null>(null);

const { mutate: search, isPending } = useSearch();

const handleSearch = async () => {
  searchError.value = null;
  searchResults.value = searchResults.value.map(user => ({...user, notificationError: undefined}));

  if (searchParam.value.param.length < 3) {
    searchError.value = 'Legalább 3 karaktert meg kell adni a kereséshez.';
    return;
  }
  console.log(loggedInUser)
  searchParam.value.loggedInUser = loggedInUser || '';

  search(searchParam.value, {
    onSuccess: (data: User[]) => {
      searchResults.value = data;
    },
    onError: (error: any) => {
      searchError.value =
        error.response?.data?.error || 'Hiba történt a keresés során.';
      console.error('Search Error:', error);
    },
  });
};

const selectUser = async (user: User) => {

  if (!loggedInUser) {
    console.error('Nincs bejelentkezett felhasználó!');
    return;
  }

  const userFriend: UserFriend = {
    id: user.id,
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
    profilePicture: user.profilePicture,
    loggedInUser: loggedInUser,
  };

  try {
    const response = await axiosClient.post(
      'http://localhost:3000/notify',
      userFriend
    );

    return response.data;
  } catch (error) {
    console.error('Email értesítés hiba:', error);
    user.notificationError = 'Már küldtél barátjelölést ennek a személynek.';
  }
};

const getProfilePictureUrl = (profilePicture: string | undefined): string | undefined => {
  if (!profilePicture) return undefined; // Return undefined instead of null
  if (profilePicture.startsWith('http')) return profilePicture;
  return `http://localhost:3000/${profilePicture}`;
};

const handleImageError = (event: any) => {
  event.target.style.display = 'none';
  event.target.parentElement.querySelector('.profile-placeholder').style.display = 'block';
};
</script>

<style scoped>
.input-field :deep(.v-input__control) {
    background-color: #d8b3e6 !important;
    width: 100%;
    border-radius: 8px;
    border: 1px solid black;
  }
.search-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 100px;
  
}
.search-button{
  border: 1px solid black;
}
.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 20px;
  overflow-y: auto;
  padding: 15px;
  box-sizing: border-box;
  font-family: 'Lucida Console', monospace;

}

.form-card {
  width: 100%;
  max-width: 90%;
  padding: 20px;
  background: #bb79d2;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin: 0px;
  border-radius: 30px;
  border: 7px solid #6e2d86;
  box-sizing: border-box;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
}

.input-field {
  width: 100%;
  margin-bottom: 10px;
}

.results {
  width: 100%;
  margin-top: 10px;
  overflow-y: auto;
  max-height: 500px;
  border-radius: 30px;
  padding: 20px;
  box-sizing: border-box;
}

.user-card {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 5px;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
}

.profile-pic {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
  flex-shrink: 0;
}

.profile-placeholder {
  width: 60px;
  height: 60px;
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
  flex-grow: 1;
}

.friend-placeholder {
  font-size: 20px;
}

.error-message {
  color: red;
  font-size: 0.8rem;
  margin-top: 5px;
}

@media (max-width: 768px) {

.search-view{
  margin-top: 400px;
}
.main-content{
  margin-top: -300px;

}
  .profile-pic {
    width: 40px;
    height: 40px;
  }
  .user-name {
    font-size: 0.9rem;
  }
}

</style>
