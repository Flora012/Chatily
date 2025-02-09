<script lang="ts" setup>
import axiosClient from '@/lib/axios';
import { ref } from 'vue';

const responseRef = ref({})
axiosClient.put("https://restcountries.com/v3.1/name/hungary")
.then(response => {
    responseRef.value = response.data
})
.catch((error) => {
    console.log({error})
})
.finally(() => {
    console.log("hiba")
})
    
</script>
<template>
    <h1>Country</h1>
    {{ responseRef }}
</template>