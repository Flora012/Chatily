<template>
    <v-btn :color="data?.status ? 'green' : 'error'" :loading="isLoading">
        Fut
    </v-btn>
</template>
<script lang="ts" setup>
import { useGetHealth } from '@/api/health/healthQuery';


const {data, isLoading} = useGetHealth()
</script>