<template>
  <div class="messages-view">
    <div class="messages">
      <div class="friend-name-container">
        <h2 class="friend-name" @dblclick="openNicknameModal">
          {{ displayedName }}
        </h2>
      </div>
      <div class="light-gray-rectangle">

        <div v-if="messages.length === 0" class="message-content">
          <p id="p">Az üzeneteid majd {{ displayedName }} felhasználóval ide fognak jönni...</p>
        </div>
        <div v-else class="message-container" ref="messageContainer">
          <div
            v-for="message in messages"
            :key="message.id"
            :class="[
              'message',
              message.sender_id == loggedInUserId
                ? 'message-outgoing'
                : 'message-incoming',
            ]"
          >
            <p
              v-for="(line, index) in splitMessage(message.content)"
              :key="index"
              class="message-text"
            >
              {{ line }}
            </p>
          </div>
        </div>
        <div v-if="!isBlocked" class="message-input-container">
          <input
            type="text"
            class="message-input"
            placeholder="Írd ide az üzeneted..."
            v-model="newMessage"
            @keyup.enter="sendMessage"
          />
          <button class="send-button" @click="sendMessage">Elküld</button>
        </div>
        <div v-else class="blocked">
          <p id="blockedMessage"> {{ displayedName }} felhasználó letiltott téged</p>
        </div>
      </div>
    </div>
    <v-dialog v-model="isNicknameModalOpen" max-width="500">
      <v-card>
        <v-card-title>Becenév beállítása</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newNickname"
            label="Új becenév"
            variant="outlined"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="saveNickname">Mentés</v-btn>
          <v-btn color="secondary" @click="closeNicknameModal">Mégse</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref, onMounted, watch, nextTick } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'MessagesView',
  props: {
    name: {
      type: String,
      required: true,
    },
    friendId: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const messages = ref([]);
    const loggedInUserId = localStorage.getItem('userId');
    const messageContainer = ref<HTMLElement | null>(null);
    const newMessage = ref('');
    const isNicknameModalOpen = ref(false);
    const newNickname = ref('');
    const displayedName = ref(props.name.replace('%20', ' '));
    const nickname = ref<string | null>(null);
      const isBlocked = ref(false);


    const fetchNickname = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/notify/nickname/${loggedInUserId}/${props.friendId}`
        );
        
        if (response.data) {
          
          const nicknameData = response.data.nickname;
          nickname.value = nicknameData !== undefined ? nicknameData : null; 

          
          displayedName.value = nickname.value || `${response.data.firstname} ${response.data.lastname}`;
        }
      } catch (error) {
        console.error('Error fetching nickname:', error);
        
        displayedName.value = `${props.name.replace('%20', ' ')}`;
      }
    };
    const fetchBlockedStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/user/isBlocked/${loggedInUserId}/${props.friendId}`
        );
        
        isBlocked.value = response.data.isBlocked;
      } catch (error) {
        console.error('Error fetching blocked status:', error);
      }
    };


    const openNicknameModal = () => {
      isNicknameModalOpen.value = true;
      newNickname.value = nickname.value || '';
    };

    const closeNicknameModal = () => {
      isNicknameModalOpen.value = false;
    };

    const saveNickname = async () => {
      try {
        await axios.post('http://localhost:3000/notify/nicknames', {
          sender_id: loggedInUserId,
          receiver_id: props.friendId,
          nickname: newNickname.value,
        });
        nickname.value = newNickname.value;
        displayedName.value = newNickname.value;
        closeNicknameModal();
      } catch (error) {
        console.error('Error saving nickname:', error);
      }
    };

    const fetchMessages = async (friendId:number) => {
      try {
        

        const response = await axios.get(
          `http://localhost:3000/notify/messages/${props.friendId}/${loggedInUserId}`
        );
        messages.value = response.data;
        
        await nextTick();
        if (messageContainer.value) {
          messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
        }
        await fetchNickname();
        await fetchBlockedStatus();
      } catch (error) {
        console.error('Nem sikerült lekérni az üzeneteket:', error);
      }
    };

    const sendMessage = async () => {
      if (newMessage.value.trim() === '') {
        return;
      }

      try {
        const messageData = {
          sender_id: loggedInUserId,
          receiver_id: props.friendId,
          content: newMessage.value,
        };
        await axios.post('http://localhost:3000/notify/messages', messageData);
        newMessage.value = '';
        await fetchMessages(props.friendId);
      } catch (error) {
        console.error('Nem sikerült elküldeni az üzenetet:', error);
      }
    };

    const splitMessage = (message: string): string[] => {
      const maxLineLength = 80;
      const words = message.split(' ');
      const lines: string[] = [];
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

    onMounted(() => {
      fetchMessages(props.friendId);
    });

    watch(
      () => props.friendId,
      (newVal) => {
        fetchMessages(newVal);
      }
    );

    return {
      messages,
      name: ref(props.name.replace('%20', ' ')),
      fetchMessages,
      loggedInUserId,
      splitMessage,
      messageContainer,
      newMessage,
      sendMessage,
      isNicknameModalOpen,
      newNickname,
      openNicknameModal,
      closeNicknameModal,
      saveNickname,
      displayedName,
      isBlocked,
    };
  },
});
</script>

<style scoped>
.messages-view {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  min-height: 90vh; 
  overflow: hidden;
  margin-top: 50px;

}

.messages {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
  height: 750px;
  margin: 0 auto; 
  padding: 0 10px; 
}

.friend-name-container {
  background-color: #d9d9d9;
  padding: 5px 10px;
  border-radius: 5px;
  width: 100%;
  margin-bottom: 15px;
  margin-top: -5%;
  position: sticky;
  top: 0;
  z-index: 10;
}

.friend-name {
  margin: 0;
  font-weight: bold;
  color: black;
  font-size: 1.7rem;
  text-align: center;
  cursor: pointer;
}

.light-gray-rectangle {
  background-color: #f0f0f0;
  width: 100%;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  flex: 1;
  overflow: hidden;
  position: relative;
}

.message-content {
  font-size: 150%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  width: 100%;
}

#p {
  margin: 0;
  text-align: center;
}

.message-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
  overflow-y: auto;
  flex: 1;
  padding-bottom: 60px;
  margin-top: 40px;
}

.message {
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 15px;
  word-wrap: break-word;
}

.message-outgoing {
  background-color: #0084ff;
  color: white;
  align-self: flex-end;
}

.message-incoming {
  background-color: #e5e5ea;
  color: black;
  align-self: flex-start;
}

.message-text {
  margin: 0;
  font-size: 1rem;
}

.message-input-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 10px;
  background-color: #f0f0f0;
  box-sizing: border-box;
  display: flex;
  flex-direction: row; 
  align-items: center; 
  gap: 10px; 
}
.blocked{
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 10px;
}
#blockedMessage{
  margin: 0;
  font-size: 1.3rem;
  text-align: center;
}


.message-input {
  flex-grow: 1; 
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

.send-button {
  background-color: #0084ff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;
  white-space: nowrap; 
}

@media (max-width: 768px) {
  .messages {
    max-width: 100%; 
    height: calc(90vh - 50px);
  }

  .messages-view{
    height: 90vh;
    margin-top: -60px;
  }
  
  .friend-name {
    font-size: 1.5rem;
  }

  .message-content {
    font-size: 1.2rem;
  }

  .message {
    max-width: 90%; 
  }

  .message-input{
    width: 100%;
  }
}

@media (max-width: 480px) {
  .friend-name {
    font-size: 1.3rem;
  }

  .message-content {
    font-size: 1rem;
  }

  .message-input{
    width: 100%;
  }

  
}
</style>