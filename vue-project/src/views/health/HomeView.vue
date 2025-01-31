<script lang="ts" setup>
import { useRouter } from 'vue-router';


const {push} = useRouter()
</script>
<template>
    <v-btn @click="() => {push({name: 'health'})}">Health</v-btn>
</template>