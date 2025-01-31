<script lang="ts" setup>
import { useGetHealth } from '@/api/health/healthQuery';
import { useRouter } from 'vue-router';

const {data, isLoading} = useGetHealth()
console.log(data)

const {back} = useRouter()
</script>
<template>
    <v-btn :color="data?.status === 'success' ? 'green' : 'red'" :loading="isLoading">
        {{ data?.status === 'success' ? 'Aktív' : 'Inaktív' }}
    </v-btn>
    <v-btn @click="back">Vissza</v-btn>
</template>