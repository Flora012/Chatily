<template>
  <div class="notification-view">
    <div class="main-content" ref="mainContentRef">
      <h2 id="notification-title">Értesítések</h2>
      <div class="notification-container">
        <v-list>
          <div
            v-for="notification in notifications"
            :key="notification.id"
            class="notification-wrapper"
            @contextmenu.prevent="showNotificationContextMenu($event, notification.id)"
          >
            <v-list-item>
              <v-list-item-content class="notification-content">
                <p
                  v-for="(line, index) in splitMessage(notification.message)"
                  :key="index"
                  class="notification-text"
                >
                  {{ line }}
                </p>
              </v-list-item-content>

              <v-list-item-action
                v-if="notification.type === 'friend_request'"
                class="action-buttons"
              >
                <v-btn
                  class="accept-button"
                  color="green"
                  @click="
                    acceptFriendRequest(
                      notification.id,
                      notification.sender_id
                    )
                  "
                >
                  <p>Elfogadom</p>
                </v-btn>
                <v-btn
                  class="reject-button"
                  color="red"
                  @click="
                    rejectFriendRequest(
                      notification.id,
                      notification.sender_id
                    )
                  "
                >
                  <p>Elutasítom</p>
                </v-btn>
              </v-list-item-action>

              <v-list-item-action
                v-if="notification.type === 'group_invitation'"
                class="action-buttons"
              >
                <v-btn
                  class="accept-button"
                  color="green"
                  @click="
                    acceptGroupInvitation(
                      notification.id,
                      notification.group_id,
                      notification.sender_id
                    )
                  "
                >
                  <p>Elfogadom</p>
                </v-btn>
                <v-btn
                  class="reject-button"
                  color="red"
                  @click="
                    rejectGroupInvitation(
                      notification.id,
                      notification.group_id,
                      notification.sender_id
                    )
                  "
                >
                  <p>Elutasítom</p>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </div>
        </v-list>
      </div>
      <NotificationContextView
        :x="contextMenuX"
        :y="contextMenuY"
        :is-visible="isContextMenuVisible"
        :notification-id="selectedNotificationId"
        @delete="handleDeleteNotification"
        @close="closeContextMenu"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUpdated } from 'vue';
import axios from 'axios';
import NotificationContextView from '@/components/NotificationContextView.vue';
import { defineEmits } from 'vue';

const emit = defineEmits(['refreshFriends', 'refreshGroups']);
const userId = localStorage.getItem('userId');
const notifications = ref([]);
const mainContentRef = ref(null);
const contextMenuX = ref(0);
const contextMenuY = ref(0);
const isContextMenuVisible = ref(false);
const selectedNotificationId = ref(null);

const fetchUserData = async () => {
  try {
    await fetchNotifications();
  } catch (error) {
    console.error('Nem sikerült lekérni a felhasználói adatokat:', error);
  }
};

const fetchNotifications = async () => {
  console.log(userId)
  if (!userId) return;
  try {
    const response = await axios.get(
      `http://localhost:3000/notifications/${userId}`
    );
    notifications.value = response.data;
  } catch (error) {
    console.error('Nem sikerült lekérni az értesítéseket:', error);
  }
};

const acceptFriendRequest = async (notificationId, senderId) => {
  try {
    await axios.post('http://localhost:3000/notifications/accept', {
      senderId,
      receiverId: userId,
    });
    await axios.delete(`http://localhost:3000/notifications/${notificationId}`);
    await fetchNotifications();
    emit('refreshFriends');
  } catch (error) {
    console.error('Hiba az értesítés elfogadásakor:', error);
  }
};

const rejectFriendRequest = async (notificationId, senderId) => {
  try {
    await axios.post('http://localhost:3000/notifications/reject', {
      senderId,
      receiverId: userId,
    });
    await axios.delete(`http://localhost:3000/notifications/${notificationId}`);
    await fetchNotifications();
  } catch (error) {
    console.error('Hiba az értesítés elutasításakor:', error);
  }
};

const acceptGroupInvitation = async (notificationId, groupId, senderId) => {
  try {
    await axios.post('http://localhost:3000/notifications/acceptGroup', {
      notificationId,
      groupId,
      userId: userId,
      senderId
    });
    await axios.delete(`http://localhost:3000/notifications/${notificationId}`);
    await fetchNotifications();
    emit('refreshGroups');
  } catch (error) {
    console.error('Hiba a csoportmeghívás elfogadásakor:', error);
  }
};

const rejectGroupInvitation = async (notificationId, groupId, senderId) => {
  try {
    await axios.post('http://localhost:3000/notifications/rejectGroup', {
      notificationId,
      groupId,
      userId: userId,
      senderId
    });
    await axios.delete(`http://localhost:3000/notifications/${notificationId}`);
    await fetchNotifications();
  } catch (error) {
    console.error('Hiba a csoportmeghívás elutasításakor:', error);
  }
};

const splitMessage = (message) => {
  const maxLineLength = 80;
  const words = message.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    if (currentLine.length === 0) {
      currentLine = word;
    } else if (currentLine.length + word.length + 1 <= maxLineLength) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
};

const handleScroll = () => {
  if (mainContentRef.value) {
    const element = mainContentRef.value;
    const isAtBottom =
      element.scrollHeight - element.scrollTop === element.clientHeight;

    if (isAtBottom) {
      element.classList.add('bottom-margin');
    } else {
      element.classList.remove('bottom-margin');
    }
  }
};
const showNotificationContextMenu = (event, notificationId) => {
  contextMenuX.value = event.clientX;
  contextMenuY.value = event.clientY;
  isContextMenuVisible.value = true;
  selectedNotificationId.value = notificationId;
};

const closeContextMenu = () => {
  isContextMenuVisible.value = false;
};

const handleDeleteNotification = async (notificationId) => {
  
  try {
    const notification = notifications.value.find(n => n.id === notificationId);
    if (notification && notification.type === 'group_invitation') {
      await axios.delete(`http://localhost:3000/groupMembers/delete/${notification.group_id}/${userId}`);
    }
    await axios.delete(`http://localhost:3000/notifications/${notificationId}`);
    await fetchNotifications();
    
  } catch (error) {
    console.error('Hiba az értesítés törlésekor:', error);
  }
};

onUpdated(() => {
  handleScroll();
});
onMounted(() => {
  fetchUserData();
});
</script>

<style scoped>



#notification-title{
  font-weight: bold;
  font-size: 2rem;
  text-decoration: underline;

}
.notification-view {
  width: 100%;
  height: 100%;
  padding: 10px;
  font-family: 'Lucida Console', monospace;

}

.main-content {
  display: flex;
  flex-direction: column;
  background-color: white;
  width: 100%;
  overflow-y: auto;
  padding: 10px;
  border-radius: 15px;
  position: relative;
  height: 99%;
}

.bottom-margin {
  margin-bottom: 1%;
}

.notification-wrapper {
  background-color: #ebd9f2;
  border-radius: 15px;
  padding: 10px;
  margin-bottom: 5px;
  width: 100%;
  word-wrap: break-word;
  border: 0.5px solid black;
}

.notification-container {
  overflow-y: auto;
  width: 100%;
  height: 100%;
}

.notification-content {
  width: 100%;
}

.notification-text {
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
}

.accept-button,
.reject-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 10px;
  border-radius: 5px;
  min-width: 90px;
  border: 1px solid black;
}

.accept-button p,
.reject-button p {
  margin: 0;
}
</style>
