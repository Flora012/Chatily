<template>
  <div
    class="group-context-menu"
    :style="{ left: x + 'px', top: y + 'px' }"
    v-show="isVisible"
    ref="contextMenu"
  >
    <ul>
      <li v-if="isAdmin" class="delete" @click="deleteGroup">Törlés</li>
      <li v-if="isAdmin" class="rename" @click="renameGroup">
        Csoport átnevezése
      </li>
      <li v-if="isAdmin" class="change-description" @click="changeDescription">
        Csoport leírásának megváltoztatása
      </li>
      <li v-if="!isAdmin" class="leave" @click="showLeaveConfirmation">
        Kilépés
      </li>
    </ul>
  </div>

  <v-dialog v-model="isLeaveDialogVisible" width="500">
    <v-card>
      <v-card-title class="headline">Kilépés a csoportból</v-card-title>
      <v-card-text>
        Biztosan ki szeretnél lépni a(z) {{ groupName }} csoportból?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" variant="text" @click="isLeaveDialogVisible = false"
          >Mégse</v-btn
        >
        <v-btn color="red darken-1" variant="text" @click="confirmLeaveGroup"
          >Kilépés</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';

const props = defineProps({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  isVisible: { type: Boolean, required: true },
  groupId: { type: Number, required: true },
  groupName: { type: String, required: true },
  isAdmin: { type: Boolean, required: true },
  userId: { type: Number, required: true },
});

const emit = defineEmits([
  'delete',
  'rename',
  'changeDescription',
  'leave',
  'message',
  'close',
]);
const isLeaveDialogVisible = ref(false);
const contextMenu = ref<HTMLElement | null>(null);

const deleteGroup = () => {
  emit('delete', props.groupId);
  emit('close');
};

const renameGroup = () => {
  emit('rename', props.groupId);
  emit('close');
};

const changeDescription = () => {
  emit('changeDescription', props.groupId);
  emit('close');
};

const showLeaveConfirmation = () => {
  isLeaveDialogVisible.value = true;
};

const confirmLeaveGroup = async () => {
  try {
    await axios.delete(
      `http://localhost:3000/groupMembers/delete/${props.groupId}/${props.userId}`
    );
    emit('leave', props.groupId);
    isLeaveDialogVisible.value = false;
    emit('close');
  } catch (error) {
    console.error('Error leaving group:', error);
  }
};

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
</script>

<style scoped>
.group-context-menu {
  position: fixed;
  background-color: white;
  border: 1px solid #ccc;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 100;
  border-radius: 5px;
}

.group-context-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.group-context-menu li {
  padding: 8px 15px;
  cursor: pointer;
  white-space: nowrap;
}

.group-context-menu li:hover {
  background-color: #f0f0f0;
}

.delete {
  color: red;
}

.leave {
  color: red;
}

.message {
  color: gray;
}
</style>
