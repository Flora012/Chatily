<template>
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2">Verification Code</v-card-title>
        <v-card-text>
          <v-text-field v-model="code" label="Enter Verification Code" type="text" />
          <v-alert v-if="error" type="error" variant="outlined">{{ error }}</v-alert>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="verify">Verify</v-btn>
          <v-btn color="secondary" variant="text" @click="dialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script lang="ts" setup>
  import { ref, defineEmits } from 'vue';
  
  const emit = defineEmits(['verify']);
  const dialog = ref(false);
  const code = ref('');
  const error = ref('');
  
  const verify = () => {
    if (!code.value) {
      error.value = 'Please enter the verification code.';
      return;
    }
    emit('verify', code.value);
    dialog.value = false;
    error.value = '';
  };
  </script>
  