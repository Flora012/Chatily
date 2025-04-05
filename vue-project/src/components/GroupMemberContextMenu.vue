<template>
  <div
    v-if="isVisible"
    class="context-menu"
    :style="{ top: y + 'px', left: x + 'px' }"
    ref="contextMenu"
  >
    <div v-if="member && member.id == loggedInUserId">
      <div class="context-menu-item" @click="changeNickname(member)">
        Becenév beállítása
      </div>
    </div>
    <div v-else-if="isGroupAdmin && member && member.role !== 'admin'">
      <div class="context-menu-item" @click="changeNickname(member)">
        Becenév megváltoztatása
      </div>
      <div
        v-if="areFriendsWithMember"
        class="context-menu-item"
        @click="sendMessageToMember(member)"
      >
        Üzenetküldés
      </div>
      <div
        v-else
        class="context-menu-item"
        @click="sendFriendRequestToMember(member)"
      >
        Legyetek barátok
      </div>
      <div
        v-if="member.role !== 'moderator'"
        class="context-menu-item moderator-option"
        @click="makeModerator(member)"
      >
        Tedd Moderátorrá
      </div>
      <div
        v-else
        class="context-menu-item moderator-option"
        @click="removeModerator(member)"
      >
        Moderátor státusz visszavonása
      </div>
      <div class="context-menu-item kick-option" @click="kickMember(member)">
        Kirúgás
      </div>
    </div>
    <div v-else-if="!isGroupAdmin && member">
      <div class="context-menu-item" @click="changeNickname(member)">
        Becenév beállítása
      </div>
      <div
        v-if="areFriendsWithMember"
        class="context-menu-item"
        @click="sendMessageToMember(member)"
      >
        Üzenetküldés
      </div>
      <div
        v-else
        class="context-menu-item"
        @click="sendFriendRequestToMember(member)"
      >
        Legyetek barátok
      </div>
    </div>
    <div v-else-if="isModerator && member && member.role !== 'admin'">
      <div class="context-menu-item" @click="changeNickname(member)">
        Becenév beállítása
      </div>
      <div class="context-menu-item kick-option" @click="kickMember(member)">
        Kirúgás
      </div>
      <div
        v-if="areFriendsWithMember"
        class="context-menu-item"
        @click="sendMessageToMember(member)"
      >
        Üzenetküldés
      </div>
      <div
        v-else
        class="context-menu-item"
        @click="sendFriendRequestToMember(member)"
      >
        Legyetek barátok
      </div>
    </div>
    <div v-else-if="isModerator && member && member.role === 'admin'">
      <div class="context-menu-item" @click="changeNickname(member)">
        Becenév beállítása
      </div>
      <div
        v-if="areFriendsWithMember"
        class="context-menu-item"
        @click="sendMessageToMember(member)"
      >
        Üzenetküldés
      </div>
      <div
        v-else
        class="context-menu-item"
        @click="sendFriendRequestToMember(member)"
      >
        Legyetek barátok
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'GroupMemberContextMenu',
  props: {
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
    isVisible: {
      type: Boolean,
      required: true,
    },
    member: {
      type: Object,
      required: false,
    },
    isGroupAdmin: {
      type: Boolean,
      required: false,
    },
    isModerator: {
      type: Boolean,
      required: false,
    },
    areFriendsWithMember: {
      type: Boolean,
      required: false,
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
  emits: [
    'changeNickname',
    'sendMessageToMember',
    'sendFriendRequestToMember',
    'makeModerator',
    'removeModerator',
    'kickMember',
    'close',
  ],
  setup(props, { emit }) {
    const contextMenu = ref<HTMLElement | null>(null);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        contextMenu.value &&
        !contextMenu.value.contains(event.target as Node)
      ) {
        emit('close');
      }
    };

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });

    const changeNickname = async (member: any) => {
      emit('changeNickname', member);
      emit('close');
    };
    const sendMessageToMember = async (member: any) => {
      emit('sendMessageToMember', member);
      emit('close');
    };
    const sendFriendRequestToMember = async (member: any) => {
      emit('sendFriendRequestToMember', member);
      emit('close');
    };
    const makeModerator = async (member: any) => {
      try {
        await axios.put(
          `http://localhost:3000/groupMembers/makeToModerator/${member.id}/${props.groupId}`
        );
        emit('makeModerator', member);
        emit('close');
      } catch (error) {
        console.error('Error making member a moderator:', error);
      }
    };
    const removeModerator = async (member: any) => {
      try {
        await axios.put(
          `http://localhost:3000/groupMembers/removeModerator/${member.id}/${props.groupId}`
        );
        emit('removeModerator', member);
        emit('close');
      } catch (error) {
        console.error('Error removing member from moderator:', error);
      }
    };
    const kickMember = async (member: any) => {
      try {
        await axios.delete(
          `http://localhost:3000/groupMembers/delete/${props.groupId}/${member.id}`
        );
        emit('kickMember', member);
        emit('close');
      } catch (error) {
        console.error('Error kicking member:', error);
      }
    };

    return {
      contextMenu,
      changeNickname,
      sendMessageToMember,
      sendFriendRequestToMember,
      makeModerator,
      removeModerator,
      kickMember,
    };
  },
});
</script>

<style scoped>
.context-menu {
  position: absolute;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 1001;
  min-width: 150px;
}

.context-menu-item {
  padding: 8px 12px;
  cursor: pointer;
  white-space: nowrap;
}

.context-menu-item:hover {
  background-color: #f0f0f0;
}

.moderator-option {
  color: blue;
}

.kick-option {
  color: red;
}
</style>
