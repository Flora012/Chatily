<template>
  <div class="profile-view">
    <div class="profile-container">
      <div class="profile-sidebar">
        <div
          class="sidebar-menu-item"
          @click="showProfileSettings"
          :class="{ active: showSettings }"
        >
          Profil beállítása
        </div>
        <div
          class="sidebar-menu-item"
          @click="showBlockedUsers"
          :class="{ active: showBlocked }"
        >
          Letiltott emberek
        </div>
      </div>
      <div class="profile-content">
        <div v-if="showSettings">
          <h2>Profil beállításai</h2>
          <div class="profile-picture-container">
            <div v-if="profilePicture" class="profile-picture">
              <img :src="profilePicture" alt="Profile Picture" />
            </div>
            <div v-else class="default-profile-picture"></div>
            <div class="edit-icon" @click="openImageUpload">
              <p id="plus">+</p>
            </div>
            <div v-if="isImageUploadOpen" class="plus-icon">
              <v-icon size="150">mdi-plus-circle</v-icon>
            </div>
          </div>
          <div class="profile-actions">
            <button class="profile-button" @click="openChangeEmailModal">
              Email megváltoztatása
            </button>
            <button class="profile-button" @click="openChangePasswordModal">
              Jelszó megváltoztatása
            </button>
            <button class="profile-button delete-button" @click="openDeleteAccountModal">
              Fiók törlése
            </button>
          </div>
        </div>
        <div v-else-if="showBlocked">
          <h2>Letiltott emberek</h2>
          <div v-if="loadingBlockedUsers">Betöltés...</div>
          <div v-else-if="errorLoadingBlockedUsers">Hiba a letiltott emberek betöltése során...</div>
          <ul v-else>
            <li v-for="user in blockedUsers" :key="user.id" class="blocked-user-item">
              <span class="user-name-blocked">{{ user.firstname }} {{ user.lastname }}</span>
              <v-btn color="#8e39ac" @click="unblockUser(user.id)">Feloldás</v-btn>
            </li>

          </ul>
        </div>
        <div v-else class="profile-main">
          <h2 class="user-name">{{ userName }}</h2>
          <div class="profile-picture-container">
            <div v-if="profilePicture" class="profile-picture">
              <img :src="profilePicture" alt="Profile Picture" />
            </div>
            <div v-else class="default-profile-picture"></div>
            <div class="edit-icon" @click="openImageUpload">
              <v-icon>mdi-pencil</v-icon>
            </div>
            <div v-if="isImageUploadOpen" class="plus-icon">
              <v-icon size="150">mdi-plus-circle</v-icon>
            </div>
          </div>
          <div class="profile-actions">
            <button class="profile-button" @click="openChangeEmailModal">
              Email megváltoztatása
            </button>
            <button class="profile-button" @click="openChangePasswordModal">
              Jelszó megváltoztatása
            </button>
            <button class="profile-button delete-button" @click="openDeleteAccountModal">
              Fiók törlése
            </button>
          </div>
        </div>
      </div>
    </div>
    <input
      type="file"
      ref="fileInput"
      style="display: none"
      @change="handleFileChange"
      accept="image/*"
    />

    <v-dialog v-model="isVerificationModalOpen" max-width="300">
      <v-card>
        <v-card-title>Verifikációs kód</v-card-title>
        <v-card-text>
          <v-text-field v-model="verificationCode" label="Írd be a 6 jegyű kódot" type="number" required :error-messages="verificationError"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="closeVerificationModal">Mégse</v-btn>
          <v-btn color="primary" @click="verifyCode">Megerősítés</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isChangeEmailModalOpen" max-width="500">
      <v-card>
        <v-card-title>Email megváltoztatása</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newEmail"
            label="Új email"
            type="email"
            required
            :error-messages="emailExistsError"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="closeChangeEmailModal">Mégse</v-btn>
          <v-btn color="#8e39ac" @click="changeEmail">Mentés</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isChangePasswordModalOpen" max-width="500">
      <v-card>
        <v-card-title>Jelszó megváltoztatása</v-card-title>
        <v-card-text>
          <v-text-field v-model="oldPassword" label="Régi jelszó" type="password" required></v-text-field>
          <v-text-field v-model="newPassword" label="Új jelszó" type="password" required></v-text-field>
          <v-text-field v-model="confirmNewPassword" label="Új jelszó megerősítése" type="password" required></v-text-field>
          <div v-if="passwordError" class="error-message">{{ passwordError }}</div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="closeChangePasswordModal">Mégse</v-btn>
          <v-btn color="#8e39ac" @click="changePassword">Mentés</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-dialog v-model="isDeleteAccountModalOpen" max-width="500">
      <v-card>
        <v-card-title>Fiók törlése</v-card-title>
        <v-card-text>
          Biztosan törölni szeretnéd a fiókodat? Ez a művelet nem vonható vissza!
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="closeDeleteAccountModal">Mégse</v-btn>
          <v-btn color="error" @click="deleteAccount">Törlés</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import axios, { AxiosError } from 'axios'; 
import { useRouter } from 'vue-router';

const router = useRouter();


const showSettings = ref(true);
const showBlocked = ref(false);
const profilePicture = ref<string | null>(null);
const userName = ref<string>('');
const loggedInEmail = localStorage.getItem('userEmail');
const userId = localStorage.getItem('userId');
const blockedUsers = ref([]);
const loadingBlockedUsers = ref(false);
const errorLoadingBlockedUsers = ref(null);


const isImageUploadOpen = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);


const isChangeEmailModalOpen = ref(false);
const isChangePasswordModalOpen = ref(false);
const isDeleteAccountModalOpen = ref(false);
const isVerificationModalOpen = ref(false); 


const newEmail = ref('');
const oldPassword = ref('');
const newPassword = ref('');
const confirmNewPassword = ref('');
const emailExistsError = ref<string | null>(null);
const passwordError = ref<string | null>(null);
const verificationCode = ref('');
const verificationError = ref<string | null>(null);
const realVerificationCode = ref('');
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


const showProfileSettings = () => {
  showSettings.value = true;
  showBlocked.value = false;
};

const showBlockedUsers = async () => {
  showSettings.value = false;
  showBlocked.value = true;
  await fetchBlockedUsers();
};


const fetchUserData = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/user/${userId}`);
    if (response.data.profilePicture) {
      profilePicture.value = `http://localhost:3000/${response.data.profilePicture}`;
    }
    userName.value = `${response.data.firstname} ${response.data.lastname}`;
  } catch (error) {
    console.error('Nem sikerült lekérni a felhasználói adatokat:', error);
  }
};

const fetchBlockedUsers = async () => {
  loadingBlockedUsers.value = true;
  errorLoadingBlockedUsers.value = null;
  try {
    const response = await axios.get(`http://localhost:3000/user/blocked/${userId}`);
    blockedUsers.value = response.data;
  } catch (error) {
    errorLoadingBlockedUsers.value = error;
  } finally {
    loadingBlockedUsers.value = false;
  }
};


const openImageUpload = () => {
  isImageUploadOpen.value = !isImageUploadOpen.value;
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    const formData = new FormData();
    formData.append('profilePicture', file);
    formData.append('email', loggedInEmail);

    try {
      const response = await axios.post('http://localhost:3000/user/uploadProfilePicture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      profilePicture.value = `http://localhost:3000/${response.data.profilePicture}`;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  }
};


const openChangeEmailModal = () => {
  isChangeEmailModalOpen.value = true;
  emailExistsError.value = null;
};

const closeChangeEmailModal = () => {
  isChangeEmailModalOpen.value = false;
  newEmail.value = '';
  emailExistsError.value = null;
};

const openChangePasswordModal = () => {
  isChangePasswordModalOpen.value = true;
  passwordError.value = null;
};

const closeChangePasswordModal = () => {
  isChangePasswordModalOpen.value = false;
  oldPassword.value = '';
  newPassword.value = '';
  confirmNewPassword.value = '';
  passwordError.value = null;
};

const openDeleteAccountModal = () => {
  isDeleteAccountModalOpen.value = true;
};

const closeDeleteAccountModal = () => {
  isDeleteAccountModalOpen.value = false;
};

const openVerificationModal = () => {
  isVerificationModalOpen.value = true;
  verificationError.value = null;
  verificationCode.value = '';
};

const closeVerificationModal = () => {
  isVerificationModalOpen.value = false;
  verificationCode.value = '';
  verificationError.value = null;
};



const changeEmail = async () => {
  emailExistsError.value = null;

  if (!emailPattern.test(newEmail.value)) {
    emailExistsError.value = 'Érvénytelen e-mail cím!';
    return;
  }

  try {
    const response = await axios.post('http://localhost:3000/user/checkEmailExists', { email: newEmail.value });

    if (response.data.exists) {
      emailExistsError.value = 'Ez az e-mail cím már foglalt!';
    } else {
      
      try {
        const codeResponse = await axios.post(`http://localhost:3000/user/sendVerificationCode/${newEmail.value}`);
        realVerificationCode.value = codeResponse.data;
        openVerificationModal(); 
      } catch (codeError: any) {
        emailExistsError.value = codeError.response?.data?.error || 'Hiba történt a kód küldése közben.';
        return;
      }
    }
  } catch (error) {
    console.error('Hiba az email ellenőrzése közben:', error);
    emailExistsError.value = 'Hiba történt az e-mail ellenőrzése közben. Kérjük, próbáld újra.';
  }
};

const verifyCode = async () => {
  verificationError.value = null;

  if (verificationCode.value.toString().length !== 6) {
    verificationError.value = 'A megerősítő kódnak 6 számjegyből kell állnia.';
    return;
  }

  if (verificationCode.value === realVerificationCode.value) {
    try {

      
      const updateResponse = await axios.put('http://localhost:3000/user/updateUserEmail', { email: newEmail.value, userId: userId });
      if (updateResponse.status === 200) {
        closeChangeEmailModal();
        closeVerificationModal();
        localStorage.setItem('userEmail', newEmail.value);
      } else {
        alert('Hiba történt az email cím frissítése közben.');
      }
    } catch (error) {
      console.error('Hiba az email frissítése közben:', error);
      verificationError.value = 'Hiba történt az e-mail frissítése közben. Kérjük, próbáld újra.';
    }
  } else {
    verificationError.value = 'Nem jó kódot adtál meg. Kérlek nézd át a számok helyességét.';
  }
};

const minLength = /.{8,}/;
const hasUpperCase = /[A-Z]/;
const hasLowerCase = /[a-z]/;
const hasNumber = /[0-9]/;
const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

const validatePassword = (password: string): boolean => {
  if (!minLength.test(password)) {
    passwordError.value = "A jelszónak legalább 8 karakter hosszúnak kell lennie.";
    return false;
  } else if (!hasUpperCase.test(password)) {
    passwordError.value = "A jelszónak tartalmaznia kell legalább egy nagybetűt.";
    return false;
  } else if (!hasLowerCase.test(password)) {
    passwordError.value = "A jelszónak tartalmaznia kell legalább egy kisbetűt.";
    return false;
  } else if (!hasNumber.test(password)) {
    passwordError.value = "A jelszónak tartalmaznia kell legalább egy számot.";
    return false;
  } else if (!hasSpecialChar.test(password)) {
    passwordError.value = "A jelszónak tartalmaznia kell legalább egy speciális karaktert (!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?).";
    return false;
  }
  return true;
};

const changePassword = async () => {
  passwordError.value = null;

  if (newPassword.value !== confirmNewPassword.value) {
    passwordError.value = 'Az új jelszavak nem egyeznek meg!';
    return;
  }

  if (!validatePassword(newPassword.value)) {
    return;
  }

  try {
    const response = await axios.put('http://localhost:3000/user/changePassword', {
      userId: userId,
      oldPassword: oldPassword.value,
      newPassword: newPassword.value,
    });

    if (response.status === 200) {
      closeChangePasswordModal();
      alert('Sikeresen megváltoztattad a jelszavad!');
    } else {
      const errorData = response.data;
      passwordError.value = errorData.error || 'Hiba történt a jelszó megváltoztatása közben.';
    }
  } catch (error: unknown) { // Type the error as unknown
    if (axios.isAxiosError(error)) { // Check if it's an AxiosError
      const axiosError = error as AxiosError; // Cast to AxiosError
      if (axiosError.response?.status === 402) {
        passwordError.value = 'Az új jelszó nem lehet megegyező a régivel.';
      } else if (axiosError.response?.status === 401) {
        passwordError.value = 'Az új jelszó nem lehet megegyező a régivel, vagy helytelen régi jelszót adtál meg!';
      } else {
        console.error('Hiba a jelszó megváltoztatása közben:', axiosError);
        passwordError.value = 'Hiba történt a jelszó megváltoztatása közben. Kérjük, próbáld újra.';
      }
    } else {
      console.error('An unexpected error occurred:', error);
      passwordError.value = 'An unexpected error occurred.';
    }
  }
};

const deleteAccount = async () => {
  try {
    const response = await axios.put(`http://localhost:3000/user/deleteAccount/${userId}`);

    if (response.status === 200) {
      localStorage.removeItem('userEmail');
      localStorage.removeItem('token');
      alert('Sikeresen törölted a fiókodat!');
      router.push('/login');
    } else {
      alert('Hiba történt a fiók törlése közben.');
    }
  } catch (error) {
    console.error('Hiba a fiók törlése közben:', error);
    alert('Hiba történt a fiók törlése közben. Kérjük, próbáld újra.');
  } finally {
    closeDeleteAccountModal();
  }
};

const unblockUser = async (blockedUserId:number) => {
  try {
    await axios.delete(`http://localhost:3000/user/unblock/${userId}/${blockedUserId}`);
    await fetchBlockedUsers();
    alert('Sikeresen feloldottad a felhasználót!');
  } catch (error) {
    console.error('Error unblocking user:', error);
    alert('Hiba történt a felhasználó feloldása közben. Kérjük, próbáld újra.');
  }
};

onMounted(() => {
  fetchUserData();
});
</script>


<style scoped>
.profile-view {
  width: 80%;
  min-height: 92vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  padding-top: 60px;
  box-sizing: border-box;
  font-family: 'Lucida Console', monospace; 

}

.profile-container {
  background-color: white;
  border-radius: 15px;
  width: calc(100% - 40px);
  max-width: 1200px;
  margin: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  margin-top: -80px;
}

.profile-sidebar {
  background-color: #986ba8;
  width: 300px;
  min-height: 80vh;
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 20px;
  box-sizing: border-box;
}

.sidebar-menu-item {
  color: white;
  padding: 10px;
  cursor: pointer;
  width: 100%;
  text-align: center;
  margin-bottom: 10px;
  font-size: 1.2rem;
  font-weight: bold;
  box-sizing: border-box;
}

.sidebar-menu-item:hover {
  background-color: #6a4677;
}

.profile-content {
  flex-grow: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 50px;
  box-sizing: border-box;
  width: calc(100% - 300px);
}
.active {
  background-color: #6a4677;
}

.profile-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.user-name {
  margin-bottom: 20px;
  font-size: 1.8rem;
  font-weight: bold;
}

.profile-picture-container {
  position: relative;
  width: 300px;
  height: 300px;
  margin-bottom: 30px;
}

.profile-picture {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-picture img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.default-profile-picture {
  width: 100%;
  height: 100%;
  background-color: gray;
  border-radius: 50%;
}
.edit-icon {
  position: absolute;
  bottom: -5px;
  right: -5px;
  background-color: #bdbdbd;
  border-radius: 50%;
  padding: 2px;
  cursor: pointer;
  border: 1px solid #000000;
  width: 30px;
  height: 30px;
  z-index: 2;
  align-items: center;
  display: flex;
  justify-content: center;
}

#plus{
  font-size: 1.3rem;
}
.plus-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  color: #0084ff;
  cursor: pointer;
}
.profile-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 400px;
}

.profile-button {
  background-color: #8e39ac;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.profile-button:hover {
  background-color: #8e39ac;
}

.delete-button {
  background-color: #4f2060;
}

.delete-button:hover {
  background-color: #3c144b;
}

.blocked-users-list {
  list-style: none;
  padding: 0;
  width: 100%;
}

.blocked-user-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  margin-top: 10px;
  border-bottom: 1px solid #eee;
  width: 100%;
  box-sizing: border-box;
}

.user-name-blocked {
  font-size: 1.2rem;
  font-weight: bold;
  margin-right: 10px;
}
@media (max-width: 1024px) {
  .profile-sidebar {
    width: 200px;
  }
  .profile-content{
    width: calc(100% - 200px);
  }
  .profile-picture-container {
    width: 200px;
    height: 200px;
  }
}

@media (max-width: 768px) {
  .profile-container {
    flex-direction: column;
    width: calc(100% - 20px);
    margin: 0 10px;
  }

  .profile-sidebar{
    margin-bottom:20px ;
  }

  .profile-view{
    max-height: 500px;
  }

  .profile-sidebar {
    width: 100%;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    border-bottom-left-radius: 0;
    flex-direction: row;
    justify-content: space-around;
    padding: 10px;
  }
  .profile-content{
    padding-bottom: 20px;
    margin-top: 20px;
    width: 100%;
    height: auto;
  }

  .sidebar-menu-item {
    margin-bottom: 0;
    font-size: 1rem;
  }

  .profile-content {
    width: 100%;
    padding-top: 20px;
  }

  .profile-picture-container {
    width: 150px;
    height: 150px;
    margin-left: 30px;
  }

  .user-name {
    font-size: 1.5rem;
  }
  .profile-actions {
    max-width: 300px;
  }
}

@media (max-width: 1024px) {
  .profile-sidebar {
    width: 200px;
  }
  .profile-content{
    width: calc(100% - 200px);
  }
  .profile-picture-container {
    width: 200px;
    height: 200px;
  }
}

@media (max-width: 768px) {
  .profile-container {
    flex-direction: column;
    width: calc(100% - 20px);
    margin: 0 10px;
  }

  .profile-sidebar{
    margin-top: -470px;
    margin-bottom:20px ;
  }

  .profile-view{
    max-height: 300px;
    min-height: 750px;
    margin-top: 30px;
  }

  .profile-sidebar {
    width: 100%;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    border-bottom-left-radius: 0;
    flex-direction: row;
    justify-content: space-around;
    padding: 10px;
    min-height: 40px;

  }
  .profile-content{
    padding-bottom: 20px;
    margin-top: 20px;
    width: 442px;
    height: 354px;
  }

  .sidebar-menu-item {
    margin-bottom: 0;
    font-size: 1rem;
  }

  .profile-content {
    width: 100%;
    padding-top: 20px;
  }

  .profile-picture-container {
    width: 150px;
    height: 150px;
    margin-left: 30px;
  }

  .user-name {
    font-size: 1.5rem;
  }
  .profile-actions {
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .profile-picture-container {
    width: 120px;
    height: 120px;
    margin-left: 30px;
  }
  .user-name {
    font-size: 1.3rem;
  }
  .profile-view{
    min-height: 72.5vh;
  }
  .profile-content{
    padding-bottom: 20px;
    margin-top: 20px;
    width: 442px;
    height: 354px;
  }
  .profile-sidebar{
    min-height: 40px;

  }

  

  .profile-sidebar{
    margin-top: -370px;
    margin-bottom:20px ;
    min-height: 40px;

  }
  .profile-button {
    padding: 8px 16px;
    font-size: 0.9rem;
  }

  .sidebar-menu-item {
    font-size: 0.8rem;
  }
}
@media (max-width: 375px) {
  .profile-picture-container {
    width: 100px;
    height: 100px;
    margin-left: 30px;
  }

  .user-name {
    font-size: 1.2rem;
  }

  .profile-button {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
  .profile-content{
    padding-bottom: 20px;
    width: 100%;
    height: 354px;
  }
  .sidebar-menu-item {
    font-size: 0.7rem;
  }

  .profile-view{
    margin-top: 50px;
  }

}
</style>