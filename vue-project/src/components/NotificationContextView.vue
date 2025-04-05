<template>
  <div
    class="notification-context-menu"
    :style="{ left: x + 'px', top: y + 'px' }"
    v-show="isVisible"
    ref="contextMenu"
  >
    <ul>
      <li class="delete" @click="deleteNotification">Törlés</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const props = defineProps({
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
  notificationId: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['delete', 'close']);
const contextMenu = ref<HTMLElement | null>(null);

const deleteNotification = () => {
  emit('delete', props.notificationId);
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
.notification-context-menu {
  position: fixed;
  background-color: white;
  border: 1px solid #ccc;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 100;
  border-radius: 5px;
}

.notification-context-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notification-context-menu li {
  padding: 8px 15px;
  cursor: pointer;
  white-space: nowrap;
}

.notification-context-menu li:hover {
  background-color: #f0f0f0;
}

.delete {
  color: red;
}
</style>
