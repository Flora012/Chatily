<template>
  <div
    class="friend-context-menu"
    :style="{ left: x + 'px', top: y + 'px' }"
    v-show="isVisible"
    ref="contextMenu"
  >
    <ul>
      <li @click="sendMessage">Üzenetírás</li>
      <li @click="showDisableConfirmation" id="block">Letiltás</li>
      <li @click="showDeleteConfirmation" id="delete">Barát törlése</li>
    </ul>
  </div>

  <v-dialog v-model="isDisableDialogVisible" width="500">
    <v-card>
      <v-card-title class="headline" >Barát letiltása</v-card-title>
      <v-card-text>
        Biztosan le szeretnéd tiltani {{ friend?.firstname }}
        {{ friend?.lastname }}?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="isDisableDialogVisible = false"
          >Mégse</v-btn
        >
        <v-btn color="red-darken-1" variant="text" @click="disableFriend"
          >Letiltás</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="isDeleteDialogVisible" width="500">
    <v-card>
      <v-card-title class="headline" >Barát törlése</v-card-title>
      <v-card-text>
        Biztosan törölni szeretnéd {{ friend?.firstname }}
        {{ friend?.lastname }} barátságát? Ez törli az összes üzenetet is.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="isDeleteDialogVisible = false"
          >Mégse</v-btn
        >
        <v-btn color="red-darken-1" variant="text" @click="deleteFriend"
          >Törlés</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import type { Friend } from '@/api/search/search';

interface FriendType extends Friend {}

const props = defineProps({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  isVisible: { type: Boolean, required: true },
  friend: { type: Object as () => FriendType | null, required: true },
});

const emit = defineEmits(['disable', 'message', 'delete', 'close']);
const isDeleteDialogVisible = ref(false);
const isDisableDialogVisible = ref(false);
const contextMenu = ref<HTMLElement | null>(null);

const showDeleteConfirmation = () => (isDeleteDialogVisible.value = true);
const showDisableConfirmation = () => (isDisableDialogVisible.value = true);

const deleteFriend = () => {
  emit('delete');
  isDeleteDialogVisible.value = false;
  emit('close');
};

const disableFriend = () => {
  emit('disable');
  isDisableDialogVisible.value = false;
  emit('close');
};

const sendMessage = () => {
  emit('message');
  emit('close');
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
.friend-context-menu {
  position: fixed;
  background-color: white;
  border: 1px solid #ccc;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 100;
  border-radius: 5px;
}

.friend-context-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.friend-context-menu li {
  padding: 8px 15px;
  cursor: pointer;
  white-space: nowrap;
}

.friend-context-menu li:hover {
  background-color: #f0f0f0;
}

.disable {
  color: red;
}
#delete{
  color: red;
}
#block{
  color: red;
}

.message {
  color: gray;
}
</style>
