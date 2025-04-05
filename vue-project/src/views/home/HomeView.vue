<template>
  <div class="home-view">
    <div class="main-content">
      <div class="notifications-container">
        <NotificationView @refreshFriends="fetchFriends" @refreshGroups="fetchGroups" />
      </div>
      <div class="friends-container">
        <h2 class="titles">Barátaim</h2>
        <div class="friends-list">
          <div v-if="loadingFriends" class="loading">Barátok betöltése...</div>
          <div v-else-if="errorLoadingFriends" class="error">
            Hiba a barátok betöltése közben
          </div>
          <div v-else-if="friends.length === 0">
            <p>Nincsenek barátaid. Jelölj be valakit a keresés menüpontra kattintva</p>
          </div>
          <div v-else>
            <div
              v-for="friend in friends"
              :key="friend.id"
              class="friend-item"
              @contextmenu.prevent="showContextMenu($event, friend)"
            >
              <router-link
                :to="{
                  name: 'Messages',
                  params: {
                    name: getDisplayedName(friend),
                    friendId: friend.id,
                  },
                }"
                class="friend-link-wrapper"
              >
                <div class="friend-profile-pic">
                  <img
                    v-if="friend.profilePicture"
                    :src="getProfilePictureUrl(friend.profilePicture)"
                    class="profile-pic"
                    alt="Friend Profile Picture"
                    @error="handleImageError($event)"
                  />
                  <div v-else class="default-profile-pic"></div>
                </div>
                <div class="friend-info">
                  <div class="friend-name">
                    {{ getDisplayedName(friend) }}
                  </div>
                  <LastMessage :friendId="friend.id" :loggedInUserId="userId" />
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="groups-container">
        <h2 class="titles">Csoportjaim</h2>
        <v-btn color="#8e39ac" @click="openCreateGroupModal" id="new-group-button">Új csoport létrehozása</v-btn>
        <div class="groups-list">
          <div v-if="loadingGroups" class="loading">Csoportok betöltése...</div>
          <div v-else-if="errorLoadingGroups" class="error">
            Hiba a csoportok betöltése közben
          </div>
          <div v-else-if="filteredGroups.length === 0">
            <p>Nincsenek csoportjaid. Csinálj egyet az Új csoport létrehozása gombra kattintva.</p>
          </div>
          <div v-else>
            <div
              v-for="group in filteredGroups"
              :key="group.id"
              class="group-item"
              @contextmenu.prevent="showGroupContextMenu($event, group)"
            >
              <router-link
                :to="{
                  name: 'GroupMessages',
                  params: { groupId: group.id, groupName: group.name },
                }"
                class="group-link-wrapper"
              >
                <div class="group-name">{{ group.name }}</div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <FriendContextMenu
        :x="contextMenuX"
        :y="contextMenuY"
        :is-visible="isContextMenuVisible"
        :friend="selectedFriend"
        @disable="handleDisableFriend"
        @message="handleSendMessage"
        @delete="handleDeleteFriend"
        @close="closeContextMenu"
        ref="friendContextMenu"
      />
      <GroupContextMenu
        :x="groupContextMenuX"
        :y="groupContextMenuY"
        :is-visible="isGroupContextMenuVisible"
        :group="selectedGroup"
        :is-admin="isGroupAdmin"
        @delete="handleDeleteGroup"
        @rename="openRenameModal"
        @changeDescription="openChangeDescriptionModal"
        @leave="handleLeaveGroup"
        @message="handleSendMessageToGroup"
        @close="closeGroupContextMenu"
      />
    </div>
    
    <v-dialog v-model="isRenameModalOpen" max-width="500">
      <v-card>
        <v-card-title>Csoport átnevezése</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newGroupName"
            label="Új csoportnév"
            variant="outlined"
            :counter="25"
            :rules="[rules.required, rules.maxLength(25)]"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="saveNewGroupName">Mentés</v-btn>
          <v-btn color="secondary" @click="closeRenameModal">Mégse</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="isChangeDescriptionModalOpen" max-width="500">
      <v-card>
        <v-card-title>Csoport leírásának megváltoztatása</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newGroupDescription"
            label="Új csoportleírás"
            variant="outlined"
            :counter="50"
            :rules="[rules.maxLength(50)]"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="saveNewGroupDescription">Mentés</v-btn>
          <v-btn color="secondary" @click="closeChangeDescriptionModal">Mégse</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="isCreateGroupModalOpen" max-width="500">
      <v-card>
        <v-card-title>Új csoport létrehozása</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newGroupName"
            label="Csoport neve"
            variant="outlined"
            :counter="25"
            :rules="[rules.required, rules.maxLength(25)]"
          />
          <v-text-field
            v-model="newGroupDescription"
            label="Csoport leírása"
            variant="outlined"
            :counter="50"
            :rules="[rules.maxLength(50)]"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="createGroup">Létrehozás</v-btn>
          <v-btn color="secondary" @click="closeCreateGroupModal">Mégse</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import NotificationView from '@/views/notification/NotificationView.vue';
import LastMessage from '@/views/messages/LastMessage.vue';
import FriendContextMenu from '@/components/FriendContextMenu.vue';
import GroupContextMenu from '@/components/GroupContextMenu.vue';

export default {
  name: 'HomeView',
  components: {
    NotificationView,
    LastMessage,
    FriendContextMenu,
    GroupContextMenu,
  },
  data() {
    return {
      friends: [],
      loadingFriends: false,
      errorLoadingFriends: null,
      groups: [],
      loadingGroups: false,
      errorLoadingGroups: null,
      userId: null,
      contextMenuX: 0,
      contextMenuY: 0,
      isContextMenuVisible: false,
      selectedFriend: null,
      groupContextMenuX: 0,
      groupContextMenuY: 0,
      isGroupContextMenuVisible: false,
      selectedGroup: null,
      isGroupAdmin: false,
      isRenameModalOpen: false,
      isChangeDescriptionModalOpen: false,
      newGroupName: '',
      newGroupDescription: '',
      isCreateGroupModalOpen: false,
      successMessage: null,
      errorMessage: null,
      rules: {
        required: (value) => !!value || 'Kötelező mező!',
        maxLength: (max) => (value) => value.length <= max || `Maximum ${max} karakter!`,
      },
      pollingInterval: null,
      friendDisplayNames: {},
    };
  },
  computed: {
    filteredGroups() {
      return this.groups.filter(group => group.status === 'accepted');
    },
  },
  mounted() {
    this.fetchUserId();
    
  },
  beforeUnmount() {
    clearInterval(this.pollingInterval);
  },
  methods: {
    async fetchUserId() {
      try {

        this.userId = localStorage.getItem('userId');
        this.fetchFriends();
        this.fetchGroups();
      } catch (error) {
        console.error('Error fetching user id:', error);
      }
    },
    async fetchFriends() {
      this.loadingFriends = true;
      this.errorLoadingFriends = null;
      try {
        const response = await axios.get(
          `http://localhost:3000/notify/friends/${this.userId}`
        );
        this.friends = response.data;
        await this.fetchFriendDisplayNames();
      } catch (error) {
        this.errorLoadingFriends = error.message;
        console.error('Error fetching friends:', error);
      } finally {
        this.loadingFriends = false;
      }
    },
    async fetchFriendDisplayNames() {
      const promises = this.friends.map(async (friend) => {
        const displayName = await this.getDisplayedNameAsync(friend);
        this.friendDisplayNames[friend.id] = displayName;
      });
      await Promise.all(promises);
    },
    async fetchGroups() {
      this.loadingGroups = true;
      this.errorLoadingGroups = null;
      try {
        const response = await axios.get(
          `http://localhost:3000/groupMembers/groups/${this.userId}`
        );
        this.groups = response.data;
      } catch (error) {
        this.errorLoadingGroups = error.message;
        console.error('Error fetching groups:', error);
      } finally {
        this.loadingGroups = false;
      }
    },
    showContextMenu(event, friend) {
      this.contextMenuX = event.clientX;
      this.contextMenuY = event.clientY;
      this.isContextMenuVisible = true;
      this.selectedFriend = friend;
    },
    closeContextMenu() {
      this.isContextMenuVisible = false;
    },
    async handleDisableFriend() {
      try {
        await axios.post(`http://localhost:3000/notifications/block`, { userId: this.userId, friendId: this.selectedFriend.id, message: 'Sikeresen letiltottad a barátot!' });
        this.successMessage = 'Sikeresen letiltottad a barátot!';
        this.friends = this.friends.filter(friend => friend.id !== this.selectedFriend.id);
        setTimeout(() => this.successMessage = null, 3000);
        this.fetchFriends(); 
      } catch (error) {
        this.errorMessage = 'Hiba történt a barát letiltásakor!';
        setTimeout(() => this.errorMessage = null, 3000);
        console.error('Error disabling friend:', error);
      }
    },
    handleSendMessage() {
      this.$router.push({ name: 'Messages', params: { friendId: this.selectedFriend.id, name: `${this.selectedFriend.firstname} ${this.selectedFriend.lastname}` } });
    },
    handleSetNickname() {
    },
    getDisplayedName(friend) {
        if (this.friendDisplayNames[friend.id]) {
            return this.friendDisplayNames[friend.id];
        }
        return `${friend.firstname} ${friend.lastname}`;
    },
    async getDisplayedNameAsync(friend) {
      try {
        const nicknameResponse = await axios.get(`http://localhost:3000/notify/nickname/${this.userId}/${friend.id}`);
        return nicknameResponse.data.nickname || `${friend.firstname} ${friend.lastname}`;
      } catch (error) {
        console.error("Error fetching nickname:", error);
        return `${friend.firstname} ${friend.lastname}`;
      }
    },
    async showGroupContextMenu(event, group) {
      this.groupContextMenuX = event.clientX;
      this.groupContextMenuY = event.clientY;
      this.isGroupContextMenuVisible = true;
      this.selectedGroup = group;
      await this.checkIfGroupAdmin(group.id);
    },
    closeGroupContextMenu() {
      this.isGroupContextMenuVisible = false;
    },
    async checkIfGroupAdmin(groupId) {
      try {
        const response = await axios.get(`http://localhost:3000/groupMembers/isAdmin/${groupId}/${this.userId}`);
        this.isGroupAdmin = response.data.isAdmin;
      } catch (error) {
        console.error('Error checking if user is group admin:', error);
        this.isGroupAdmin = false;
      }
    },
    async handleDeleteGroup() {
      try {
        await axios.delete(`http://localhost:3000/groups/${this.selectedGroup.id}`);
        this.groups = this.groups.filter(group => group.id !== this.selectedGroup.id);
        this.fetchGroups(); 
      } catch (error) {
        console.error('Hiba a csoport törlésekor:', error);
      }
    },
    openRenameModal() {
      this.isRenameModalOpen = true;
      this.newGroupName = '';
    },
    closeRenameModal() {
      this.isRenameModalOpen = false;
    },
    async saveNewGroupName() {
      try {
        await axios.put(`http://localhost:3000/groups/rename/${this.selectedGroup.id}`, { newName: this.newGroupName });
        const groupIndex = this.groups.findIndex(group => group.id === this.selectedGroup.id);
        if (groupIndex !== -1) {
          this.groups[groupIndex].name = this.newGroupName;
        }
        this.closeRenameModal();
        this.fetchGroups(); 
      } catch (error) {
        console.error('Error renaming group:', error);
      }
    },
    openChangeDescriptionModal(groupId) {
      this.isChangeDescriptionModalOpen = true;
      this.selectedGroupId = groupId;
      this.newGroupDescription = '';
    },
    closeChangeDescriptionModal() {
      this.isChangeDescriptionModalOpen = false;
      this.selectedGroupId = null;
    },
    async saveNewGroupDescription() {
      try {
        await axios.put(`http://localhost:3000/groups/changeDescription/${this.selectedGroupId}`, { newDescription: this.newGroupDescription });
        this.closeChangeDescriptionModal();
        this.fetchGroups(); 
      } catch (error) {
        console.error('Error changing group description:', error);
      }
    },
    async handleLeaveGroup() {
      try {
        await axios.delete(`http://localhost:3000/groupMembers/delete/${this.selectedGroup.id}/${this.userId}`);
        this.groups = this.groups.filter(group => group.id !== this.selectedGroup.id);
        this.fetchGroups(); 
      } catch (error) {
        console.error('Hiba a csoportból való kilépéskor:', error);
      }
    },
    handleSendMessageToGroup(groupId, groupName) {
      this.$router.push({
        name: 'GroupMessages',
        params: { groupId: groupId, groupName: groupName },
      });
    },
    handleRenameGroup(groupId) {
        this.openRenameModal(groupId);
    },
    handleChangeGroupDescription(groupId) {
        this.openChangeDescriptionModal(groupId);
    },
    openCreateGroupModal() {
      this.isCreateGroupModalOpen = true;
      this.newGroupName = '';
      this.newGroupDescription = '';
    },
    closeCreateGroupModal() {
      this.isCreateGroupModalOpen = false;
    },
    async createGroup() {
      try {
        const response = await axios.post('http://localhost:3000/groups', {
          name: this.newGroupName,
          description: this.newGroupDescription,
          loggedInUserId: this.userId,
        });
        this.groups.push(response.data); 
        this.closeCreateGroupModal();
        await this.fetchGroups(); 
      } catch (error) {
        console.error('Error creating group:', error);
      }
    },


    getProfilePictureUrl(profilePicture) {
        if (!profilePicture) {
            return null;
        }
        if (profilePicture.startsWith('http')) {
            return profilePicture;
        }
        return `http://localhost:3000/${profilePicture}`;
    },
    handleImageError(event) {
        event.target.style.display = 'none';
        event.target.parentElement.querySelector('.default-profile-pic').style.display = 'block';
    },
    async handleDeleteFriend() {
      try {
        await axios.delete(`http://localhost:3000/notify/${this.selectedFriend.id}/${this.userId}`, { message: 'Sikeresen törölted a barátot!' });
        this.successMessage = 'Sikeresen törölted a barátot!';
        this.friends = this.friends.filter(friend => friend.id !== this.selectedFriend.id);
        setTimeout(() => this.successMessage = null, 3000);
        this.fetchFriends(); 
      } catch (error) {
        this.errorMessage = 'Hiba történt a barát törlésekor!';
        setTimeout(() => this.errorMessage = null, 3000);
        console.error('Error deleting friend:', error);
      }
    },
    startPolling() {
      this.pollingInterval = setInterval(() => {
        this.fetchFriends();
        this.fetchGroups();
      }, 5000); 
    },
  },
};

</script>

<style scoped>
.home-view {
  height: 90vh;
  display: flex;
  margin-top: 10px;
  flex-direction: column;
  font-family: 'Lucida Console', monospace;

}

h2{
  font-size: 2rem;

}

.main-content {
  display: flex;
  flex-grow: 1; 
  width: 100%;
  padding: 30px; 
  overflow: hidden;
  height: 95%;
}

.notifications-container, .friends-container, .groups-container {
  flex: 1; 
  background-color: white;
  border-radius: 25px;
  border:12px solid #ce9fdf;
  overflow-y: auto; 
  margin-right: 30px;
  height: 90%;
  min-width: 400px;
  box-sizing: border-box;
}

.friends-list, .groups-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  padding: 10px;
}
#new-group-button{
  margin-top: 10px;
  border: 1px solid black;
  
}
.friend-item, .group-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  width: 100%;
  justify-content: space-between;
}

.friend-link-wrapper, .group-link-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 10px;
  padding: 10px;
  background-color: #ebd9f2;
  border-radius: 20px;
  text-decoration: none;
  color: inherit;
  border: 0.5px solid black;


}

.friend-profile-pic {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.profile-pic {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.default-profile-pic {
  width: 100%;
  height: 100%;
  background-color: gray;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.default-profile-pic::before {
  content: "";
  width: 50%;
  height: 50%;
  background-color: white;
  border-radius: 50%;
}

.friend-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex-grow: 1;
}

.friend-name, .group-name {
  font-weight: bold;
  font-size: 1.2rem;
}

.loading {
  color: blue;
  font-size: 1.2rem;
}

.error {
  color: red;
  font-size: 1.2rem;
}

.success {
  color: green;
}
.titles{
  font-weight: bold;
  margin-top: 20px;
  text-decoration: underline;
}

@media (max-width: 1200px) {
  .main-content {
    flex-direction: column; 
    min-height: 1500px;
    min-width: 100%;
    margin-top: -50px;
  }
  .notifications-container, .friends-container, .groups-container {
    width: 100%;
    margin: 5px 0;
    min-width: auto; 
    min-height: 200px;
  }
  .friend-profile-pic {
    width: 50px;
    height: 50px;
  }
  .friend-name, .group-name {
    font-size: 1rem;
  }
  .titles{
    font-size: 1.5rem;
    
  }
  .friend-link-wrapper, .group-link-wrapper {
    padding: 5px; 
  }
}

@media (min-width: 1200px) {
  .notifications-container, .friends-container, .groups-container {
    min-width: 400px; 
  }
}

</style>
