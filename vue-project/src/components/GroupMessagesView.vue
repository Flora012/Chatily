<template>
  <div class="messages-view">
    <div class="main-content">
      <div class="messages">
        <div class="friend-name-container">
          <h2
            class="friend-name"
            @dblclick="openRenameModal"
            v-if="isGroupAdmin"
          >
            {{ localGroupName }}
          </h2>
          <h2 class="friend-name" v-else>{{ localGroupName }}</h2>
          <p
            class="group-description"
            @dblclick="openChangeDescriptionModal"
            v-if="groupDescription && isGroupAdmin"
          >
            {{ groupDescription }}
          </p>
          <p class="group-description" v-else-if="groupDescription">
            {{ groupDescription }}
          </p>
          <v-btn v-if="isGroupAdmin || isModerator" class="add-member-button" @click="openInviteForm" >
            <p>+</p>
          </v-btn>
        </div>
        <div class="light-gray-rectangle">
          <div class="message-content" v-if="messages.length === 0">
            <p id="p">Az üzeneteitek a/az {{ localGroupName }} csoporttal ide fognak jönni...</p>
          </div>
          <div v-else class="message-container" ref="messageContainer">
            <div
              v-for="message in messages"
              :key="message.id"
              :class="[
                'message',
                message.sender_id == Number(loggedInUserId)
                  ? 'message-outgoing'
                  : 'message-incoming',
              ]"
            >
              <div class="message-sender">
                {{ getDisplayedName(message.sender) }} 
              </div>
              <p
                v-for="(line, index) in splitMessage(message.content)"
                :key="index"
                class="message-text"
              >
                {{ line }}
              </p>
            </div>
          </div>
          <div class="message-input-container">
            <input
              type="text"
              class="message-input"
              placeholder="Írd ide az üzenetet..."
              v-model="newMessage"
              @keyup.enter="sendMessage"
            />
            <button class="send-button" @click="sendMessage">Küldés</button>
          </div>
        </div>
      </div>
      <div class="group-members-container">
        <h2>Csoporttagok</h2>
        <div v-if="loadingGroupMembers" class="loading">Csoporttagok betöltése...</div>
        <div v-else-if="errorLoadingGroupMembers" class="error">
          Hiba a csoporttagok betöltése közben
        </div>
        <div v-else>
          <div
            v-for="member in groupMembersDetails"
            :key="member.id"
            class="member-item-wrapper"
            :class="{ disabled: member.id == Number(loggedInUserId) }"
            @click="member.id != Number(loggedInUserId) && handleMemberClick(member)"
            @contextmenu.prevent="openContextMenu($event, member)"
          >
            <div class="member-name">
              <span v-if="member.nickname">{{ member.nickname }}</span>
              <span v-else>{{ member.firstname }} {{ member.lastname }}</span>
            </div>
            <span v-if="member.role === 'admin'" class="member-role admin-role"
              >Admin</span
            >
            <span v-else-if="member.role === 'moderator'" class="member-role moderator-role">Moderátor</span>
            <span v-else class="member-role">Csoporttag</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isInviteFormVisible" class="overlay">
      <div class="invite-form">
        <h2>Meghívás a csoportba</h2>
        <div v-if="loadingFriends" class="loading">Barátok betöltése...</div>
        <div v-else-if="errorLoadingFriends" class="error">
          Hiba a barátok betöltése közben
        </div>
        <div v-else>
          <div
            v-for="friend in filteredFriends"
            :key="friend.id"
            class="user-item"
          >
            <input
              v-if="!pendingInvitations.includes(friend.id)"
              type="checkbox"
              :id="`user-${friend.id}`"
              :value="friend.id"
              v-model="selectedFriends"
            />
            <label :for="`user-${friend.id}`">{{
              friend.firstname
            }} {{ friend.lastname }}</label>
            <span
              v-if="pendingInvitations.includes(friend.id)"
              class="pending-label"
              >(Meghívva)</span
            >
          </div>
        </div>
        <button @click="inviteFriends" class="invite-button">Meghívás</button>
        <button @click="closeInviteForm" class="cancel-button">Mégse</button>
      </div>
    </div>
    <div v-if="showFriendRequestForm" class="overlay">
      <div class="friend-request-form">
        <h2>Barátkérelem küldése</h2>
        <div v-if="friendRequestMessage" class="success">
          {{ friendRequestMessage }}
        </div>
        <div v-if="friendRequestError" class="error">
          {{ friendRequestError }}
        </div>
        <form @submit.prevent="sendFriendRequest">
          <button type="submit" class="invite-button">Küldés</button>
          <button
            type="button"
            @click="closeFriendRequestForm"
            class="cancel-button"
          >
            Mégse
          </button>
        </form>
      </div>
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
    <v-dialog v-model="isSetNicknameModalOpen" max-width="500">
      <v-card>
        <v-card-title>Becenév beállítása</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newNickname"
            label="Új becenév"
            variant="outlined"
            :counter="25"
            :rules="[rules.maxLength(25)]"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="saveNewNickname">Mentés</v-btn>
          <v-btn color="secondary" @click="closeSetNicknameModal">Mégse</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <GroupMemberContextMenu
      :x="contextMenuX"
      :y="contextMenuY"
      :is-visible="contextMenuVisible"
      :member="contextMenuMember"
      :is-group-admin="isGroupAdmin"
      :is-moderator="isModerator"
      :are-friends-with-member="areFriendsWithContextMenuMember"
      @changeNickname="openSetNicknameModal"
      @sendMessageToMember="sendMessageToMember"
      @sendFriendRequestToMember="sendFriendRequestToMember"
      @makeModerator="makeModerator"
      @removeModerator="removeModerator"
      @kickMember="kickMember"
      @close="closeContextMenu"
      :group-id="groupId"
      :logged-in-user-id="Number(loggedInUserId)"
    />

  </div>
</template>



<script lang="ts">
import { defineComponent, ref, onMounted, watch, nextTick, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import GroupMemberContextMenu from '@/components/GroupMemberContextMenu.vue';

interface GroupMember {
  id: number;
  user_id: number;
  firstname: string;
  lastname: string;
  nickname: string | null;
  role: 'admin' | 'moderator' | 'member';
  groupMembersId?: {
    nickname: string | null;
  }[];
}

interface Message {
  id: number;
  group_id: number;
  sender_id: number;
  content: string;
  sender: GroupMember;
}

export default defineComponent({
  props: {
    groupName: {
      type: String,
      required: true,
    },
    groupId: {
      type: Number,
      required: true,
    },
    loggedInUserId: {
      type: Number,
      required: true,
    },
  },
  emits: ['group-updated'],
  components: {
    GroupMemberContextMenu,
  },
  setup(props, { emit }) {
    const router = useRouter();
    const messages = ref<Message[]>([]);
    const loggedInEmail = localStorage.getItem('userEmail');
    const loggedInUserId = localStorage.getItem('userId');
    const messageContainer = ref<HTMLElement | null>(null);
    const newMessage = ref('');
    const isInviteFormVisible = ref(false);
    const friends = ref<any[]>([]);
    const loadingFriends = ref(false);
    const errorLoadingFriends = ref<string | null>(null);
    const selectedFriends = ref<number[]>([]);
    const isGroupAdmin = ref(false);
    const groupMembers = ref<number[]>([]);
    const pendingInvitations = ref<number[]>([]);
    const groupMembersDetails = ref<GroupMember[]>([]);
    const loadingGroupMembers = ref(false);
    const errorLoadingGroupMembers = ref<string | null>(null);
    const showFriendRequestForm = ref(false);
    const selectedMemberId = ref<number | null>(null);
    const friendRequestMessage = ref('');
    const friendRequestError = ref('');
    const groupDescription = ref<string | null>(null);
    const localGroupName = ref('');
    const userFriend = {
      id: 0,
      email: '',
      firstname: '',
      lastname: '',
      profilePicture: '',
      loggedInEmail: loggedInEmail,
    };
    const isRenameModalOpen = ref(false);
    const isChangeDescriptionModalOpen = ref(false);
    const newGroupName = ref('');
    const newGroupDescription = ref('');
    const rules = {
      required: (value: string) => !!value || 'Kötelező mező!',
      maxLength: (max: number) => (value: string) =>
        value.length <= max || `Maximum ${max} karakter!`,
    };
    const contextMenuX = ref(0);
    const contextMenuY = ref(0);
    const contextMenuVisible = ref(false);
    const contextMenuMember = ref<any | null>(null);
    const areFriendsWithContextMenuMember = ref(false);
    const isModerator = ref(false);
    const isSetNicknameModalOpen = ref(false);
    const newNickname = ref('');
    const selectedMemberForNickname = ref<any | null>(null);

    const fetchGroupDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/groups/${props.groupId}`
        );
        groupDescription.value = response.data.description;
        localGroupName.value = response.data.name;
      } catch (error) {
        console.error('Error fetching group details:', error);
      }
    };
    const getDisplayedName = (sender: GroupMember): string => {
      if (sender.groupMembersId && sender.groupMembersId[0]?.nickname) {
        return sender.groupMembersId[0].nickname;
      } else {
        return `${sender.firstname} ${sender.lastname}`;
      }
    };

    const fetchMessages = async (groupId: number) => {
      try {
        await checkGroupAdminRole();
        await fetchGroupMembers();
        await fetchGroupDetails();
        const response = await axios.get(
          `http://localhost:3000/groupMessages/group/${props.groupId}`
        );
        messages.value = response.data;

        await nextTick();
        if (messageContainer.value) {
          messageContainer.value.scrollTop =
            messageContainer.value.scrollHeight;
        }
      } catch (error) {
        console.error('Nem sikerült lekérni az üzeneteket:', error);
      }
    };

    const sendMessage = async () => {
      if (newMessage.value.trim() === '') return;
      try {
        const messageData = {
          group_id: props.groupId,
          sender_id: loggedInUserId,
          content: newMessage.value,
        };
        await axios.post(
          'http://localhost:3000/groupMessages/create',
          messageData
        );
        newMessage.value = '';
        await fetchMessages(props.groupId);
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

    const openInviteForm = () => {
      isInviteFormVisible.value = true;
      fetchFriends();
    };

    const closeInviteForm = () => {
      isInviteFormVisible.value = false;
      selectedFriends.value = [];
    };

    const fetchFriends = async () => {
      loadingFriends.value = true;
      errorLoadingFriends.value = null;
      try {
        const loggedInResponse = await axios.get(
          `http://localhost:3000/user/loggedIn/${loggedInEmail}`
        );
        const loggedInUserId = loggedInResponse.data.id;
        const response = await axios.get(
          `http://localhost:3000/notify/friends/${loggedInUserId}`
        );
        friends.value = response.data;
      } catch (err:unknown) {
        if (err instanceof Error) {
          errorLoadingFriends.value = err.message;
        } else {
          errorLoadingFriends.value = 'An unknown error occurred.';
        }
      } finally {
        loadingFriends.value = false;
      }
    };

    const inviteFriends = async () => {
      try {
        const groupId = props.groupId;
        const invites = selectedFriends.value.map((friendId) => ({
          user_id: friendId,
          group_id: groupId,
          role: 'member',
          status: 'pending',
          loggedInUserId: loggedInUserId,
        }));
        await Promise.all(
          invites.map((invite) =>
            axios.post(`http://localhost:3000/groupMembers/notify`, invite)
          )
        );
        closeInviteForm();
      } catch (error) {
        console.error('Error inviting friends:', error);
      }
    };
    const checkGroupAdminRole = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/groupMembers/role/${loggedInUserId}/${props.groupId}`
        );
        isGroupAdmin.value = response.data === 'admin';
        isModerator.value = response.data === 'moderator';
      } catch (error) {
        isGroupAdmin.value = false;
        isModerator.value = false;
      }
    };

    const fetchGroupMembers = async () => {
      loadingGroupMembers.value = true;
      errorLoadingGroupMembers.value = null;
      try {
        const response = await axios.get(
          `http://localhost:3000/groupMembers/${props.groupId}`
        );

        groupMembersDetails.value = response.data.map(
          (member: any, index: number) => {
            try {
              if (!member.user) {
                console.error(
                  `Member at index ${index} is missing 'user' property:`,
                  member
                );
                throw new Error(
                  `Member at index ${index} is missing 'user' property`
                );
              }
              if (!member.user.firstname || !member.user.lastname) {
                console.error(
                  `Member at index ${index} is missing 'firstname' or 'lastname' property:`,
                  member
                );
                throw new Error(
                  `Member at index ${index} is missing 'firstname' or 'lastname' property`
                );
              }
              return {
                ...member,
                role: member.role,
                id: member.user_id,
                firstname: member.user.firstname,
                lastname: member.user.lastname,
                nickname: member.nickname,
                groupMembersId: member.user.groupMembersId
              };
            } catch (mapError) {
              console.error(
                `Error mapping member at index ${index}:`,
                mapError
              );
              throw mapError;
            }
          }
        );
        groupMembers.value = response.data.map(
          (member: any) => member.user_id
        );
      } catch (err) {
        if (err instanceof Error) {
          errorLoadingGroupMembers.value = err.message;
        } else {
          errorLoadingGroupMembers.value = 'An unknown error occurred.';
        }
      } finally {
        loadingGroupMembers.value = false;
      }
    };

    const filteredFriends = computed(() => {
      return friends.value.filter(
        (friend: any) => !groupMembers.value.includes(friend.id)
      );
    });
    watch(
      () => friends.value,
      async () => {
        await fetchPendingInvitations();
      }
    );
    onMounted(() => {
      fetchMessages(props.groupId);
    });

    watch(
      () => props.groupId,
      (newVal) => {
        fetchMessages(newVal);
      }
    );
    const handleMemberClick = async (member: any) => {
      try {
        const response = await axios.get(
          `http://localhost:3000/notify/checkIfFriends/${loggedInUserId}/${member.id}`
        );
        const { areFriends } = response.data;

        userFriend.id = member.id;
        userFriend.email = member.email;
        userFriend.firstname = member.firstname;
        userFriend.lastname = member.lastname;
        userFriend.profilePicture = member.profilePicture;

        if (areFriends) {
          router.push({
            name: 'Messages',
            params: {
              name: `${member.firstname} ${member.lastname}`,
              friendId: member.id,
            },
          });
        } else {
          selectedMemberId.value = member.id;
          showFriendRequestForm.value = true;
        }
      } catch (error) {
        console.error('Error checking friendship or fetching member:', error);
      }
    };
    const sendFriendRequest = async () => {
      friendRequestMessage.value = '';
      friendRequestError.value = '';
      try {
        await axios.post('http://localhost:3000/notify/', userFriend);
        friendRequestMessage.value = 'Friend request sent!';
        setTimeout(() => {
          closeFriendRequestForm();
        }, 2000);
      } catch (err) {
        friendRequestError.value = 'Error sending friend request.';
        console.error('Error sending friend request:', err);
      }
    };
    const closeFriendRequestForm = () => {
      showFriendRequestForm.value = false;
      selectedMemberId.value = null;
      friendRequestMessage.value = '';
      friendRequestError.value = '';
    };
    const openRenameModal = () => {
      if (isGroupAdmin.value) {
        isRenameModalOpen.value = true;
        newGroupName.value = localGroupName.value;
      }
    };

    const closeRenameModal = () => {
      isRenameModalOpen.value = false;
    };

    const saveNewGroupName = async () => {
      try {
        await axios.put(
          `http://localhost:3000/groups/rename/${props.groupId}`,
          { newName: newGroupName.value }
        );
        localGroupName.value = newGroupName.value;
        emit('group-updated', {
          groupId: props.groupId,
          newName: newGroupName.value,
        });
        closeRenameModal();
      } catch (error) {
        console.error('Error renaming group:', error);
      }
    };

    const openChangeDescriptionModal = () => {
      if (isGroupAdmin.value) {
        isChangeDescriptionModalOpen.value = true;
        newGroupDescription.value = groupDescription.value || '';
      }
    };

    const closeChangeDescriptionModal = () => {
      isChangeDescriptionModalOpen.value = false;
    };

    const saveNewGroupDescription = async () => {
      try {
        await axios.put(
          `http://localhost:3000/groups/changeDescription/${props.groupId}`,
          { newDescription: newGroupDescription.value }
        );
        groupDescription.value = newGroupDescription.value;
        emit('group-updated', {
          groupId: props.groupId,
          newDescription: newGroupDescription.value,
        });
        closeChangeDescriptionModal();
      } catch (error) {
        console.error('Error changing group description:', error);
      }
    };
    const openContextMenu = async (event: MouseEvent, member: any) => {
      if (!loggedInUserId) return;
      contextMenuX.value = event.clientX;
      contextMenuY.value = event.clientY;
      contextMenuVisible.value = true;
      contextMenuMember.value = member;

      try {
        const [friendResponse, roleResponse] = await Promise.all([
          axios.get(
            `http://localhost:3000/notify/checkIfFriends/${loggedInUserId}/${member.id}`
          ),
          axios.get(
            `http://localhost:3000/groupMembers/role/${loggedInUserId}/${props.groupId}`
          ),
        ]);

        areFriendsWithContextMenuMember.value = friendResponse.data.areFriends;
        isModerator.value = roleResponse.data === 'moderator';

        await nextTick();
      } catch (error) {
        console.error('Error fetching data for context menu:', error);
      }
    };

    const closeContextMenu = () => {
      contextMenuVisible.value = false;
    };
    const openSetNicknameModal = (member: any) => {
      isSetNicknameModalOpen.value = true;
      selectedMemberForNickname.value = member;
      newNickname.value = member.nickname || '';
    };

    const closeSetNicknameModal = () => {
      isSetNicknameModalOpen.value = false;
      newNickname.value = '';
      selectedMemberForNickname.value = null;
    };

    const saveNewNickname = async () => {
      if (!selectedMemberForNickname.value) return;
      try {
        await axios.put(
          `http://localhost:3000/groupMembers/updateNickname/${props.groupId}/${selectedMemberForNickname.value.id}`,
          { nickname: newNickname.value }
        );

        const memberIndex = groupMembersDetails.value.findIndex(
          (m) => m.id === selectedMemberForNickname.value.id
        );
        if (memberIndex !== -1) {
          groupMembersDetails.value[memberIndex].nickname = newNickname.value;
        }
        closeSetNicknameModal();
        await fetchMessages(props.groupId);
      } catch (error) {
        console.error('Error updating nickname:', error);
      }
    };

    const sendMessageToMember = (member: any) => {
      router.push({
        name: 'Messages',
        params: {
          name: `${member.firstname} ${member.lastname}`,
          friendId: member.id,
        },
      });
    };
    const sendFriendRequestToMember = (member: any) => {};
    const makeModerator = async (member: any) => {
      try {
        const loggedInUserEmail = localStorage.getItem('userEmail');
        const userIdResponse = await axios.get(
          `http://localhost:3000/user/loggedIn/${loggedInUserEmail}`
        );
        const loggedInUserId = userIdResponse.data.id;
        await axios.put(
          `http://localhost:3000/groupMembers/makeToModerator/${member.id}/${props.groupId}`
        );
        const memberIndex = groupMembersDetails.value.findIndex(
          (m) => m.id === member.id
        );
        if (memberIndex !== -1) {
          groupMembersDetails.value[memberIndex].role = 'moderator';
        }
      } catch (error) {
        console.error('Error making member a moderator:', error);
      }
    };
    const removeModerator = async (member: any) => {
      try {
        await axios.put(
          `http://localhost:3000/groupMembers/removeModerator/${member.id}/${props.groupId}`
        );

        const memberIndex = groupMembersDetails.value.findIndex(
          (m) => m.id === member.id
        );
        if (memberIndex !== -1) {
          groupMembersDetails.value[memberIndex].role = 'member';
        }
      } catch (error) {
        console.error('Error removing member from moderator:', error);
      }
    };
    const kickMember = async (member: any) => {
      try {
        await axios.delete(
          `http://localhost:3000/groupMembers/delete/${props.groupId}/${member.id}`
        );

        groupMembersDetails.value = groupMembersDetails.value.filter(
          (m) => m.id !== member.id
        );
      } catch (error) {
        console.error('Error kicking member:', error);
      }
    };
    const fetchPendingInvitations = async () => {
      try {
        const loggedInResponse = await axios.get(
          `http://localhost:3000/user/loggedIn/${loggedInEmail}`
        );
        const loggedInUserId = loggedInResponse.data.id;
        const response = await axios.get(
          `http://localhost:3000/groupMembers/${props.groupId}`
        );
        const groupMembers = response.data;
        pendingInvitations.value = groupMembers
          .filter((member: any) => member.status === 'pending')
          .map((member: any) => member.user_id);
      } catch (error) {
        console.error('Error fetching pending invitations:', error);
      }
    };

    return {
      messages,
      loggedInUserId,
      splitMessage,
      messageContainer,
      newMessage,
      sendMessage,
      openInviteForm,
      closeInviteForm,
      inviteFriends,
      isInviteFormVisible,
      friends,
      loadingFriends,
      errorLoadingFriends,
      selectedFriends,
      isGroupAdmin,
      filteredFriends,
      groupMembersDetails,
      loadingGroupMembers,
      errorLoadingGroupMembers,
      handleMemberClick,
      showFriendRequestForm,
      sendFriendRequest,
      closeFriendRequestForm,
      friendRequestMessage,
      friendRequestError,
      groupMembers,
      pendingInvitations,
      groupDescription,
      isRenameModalOpen,
      isChangeDescriptionModalOpen,
      newGroupName,
      newGroupDescription,
      rules,
      getDisplayedName,
      openRenameModal,
      closeRenameModal,
      saveNewGroupName,
      openChangeDescriptionModal,
      closeChangeDescriptionModal,
      saveNewGroupDescription,
      localGroupName,
      openContextMenu,
      closeContextMenu,
      contextMenuX,
      contextMenuY,
      contextMenuVisible,
      contextMenuMember,
      areFriendsWithContextMenuMember,
      changeNickname: openSetNicknameModal,
      sendMessageToMember,
      sendFriendRequestToMember,
      makeModerator,
      kickMember,
      isModerator,
      fetchPendingInvitations,
      isSetNicknameModalOpen,
      newNickname,
      openSetNicknameModal,
      closeSetNicknameModal,
      saveNewNickname,
      removeModerator,
    };
  },
});

</script>





<style scoped>
.messages-view {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  margin-top: 40px;
  overflow: hidden;
}
.friend-request-form {
  background-color: white; 
  padding: 20px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.invite-form button,
.friend-request-form button {
  margin: 15px; 
}

.main-content {
  display: flex;
  width: 100%;
  max-width: 1200px;
  gap: 20px;
  max-height: 80%;
}

.messages {
  display: flex;
  flex-direction: column;
  width: 70%;
  height: 100%;
}

.group-members-container {
  width: 30%;
  background-color: #e0e0e0;
  border-radius: 10px;
  padding: 10px;
  height: 779px;
  overflow-y: auto;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.friend-name {
  margin: 0;
  font-weight: bold;
  color: black;
  font-size: 1.7rem;
  text-align: center;
  cursor: pointer;
}

.group-description {
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
  min-height: 740px;
}

.message-content {
  font-size: 150%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 733px;
  width: 100%;
}

#p {
  margin: 0;
}

.message-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
  overflow-y: auto;
  flex: 1;
  padding-bottom: 60px;
  padding-left: 10px; 
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
  width: 90%;
  padding: 10px;
  background-color: #f0f0f0;
  box-sizing: border-box;
  display: flex;
}

.message-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  margin-right: 10px;
}

.send-button {
  background-color: #0084ff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;
}

.message-sender {
  font-weight: bold;
  margin-bottom: 5px;
}

.add-member-button {
  background-color: #8e39ac;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.invite-form {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.invite-button,
.cancel-button {
  background-color: #8e39ac;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;
}

.cancel-button {
  background-color: #ccc;
  margin-top: -30px;
}

.member-item-wrapper {
  background-color: #f0f0f0;
  padding: 5px 10px;
  border-radius: 5px;
  margin-bottom: 5px;
}

.member-name {
  font-size: 1.1rem;
  font-weight: bold;
}

.member-role {
  font-size: 0.9rem;
}

.admin-role {
  color: red;
}
.moderator-role{
    color: blue;
}


@media (max-width: 1024px) {
  .main-content {
    flex-direction: column; 
  }

  .messages {
    width: 100%; 
    
  }

  .group-members-container {
    width: 100%; 
    height: auto; 
    max-height: 300px; 
  }
  .message {
    max-width: 90%;
  }
  .friend-name{
    font-size: 1.5rem;
  }
  .message-content{
    font-size: 120%;
  }
}

@media (max-width: 600px) {
  .message-input-container {
    width: 100%;
  }
  .friend-name{
    font-size: 1.2rem;
  }
  .message-content{
    font-size: 100%;
  }
}
</style>



