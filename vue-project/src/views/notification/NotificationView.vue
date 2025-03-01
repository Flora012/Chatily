<template>
    <v-container>
      <h2>Értesítések</h2>
      <v-list>
        <v-list-item v-for="notification in notifications" :key="notification.id">
          <v-list-item-content>
            <v-list-item-title>
              {{ notification.message }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-container>
  </template>
  
  <script setup>
  import { useNotifications } from "@/api/notifications/notificationsQuery";
  import { useUserStore } from "@/stores/userStore";
  
  const userStore = useUserStore();
  const { data: notifications } = useNotifications(userStore.userId);
  </script>
  