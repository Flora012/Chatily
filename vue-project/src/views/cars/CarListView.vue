<script lang="ts" setup>
import { useRouter } from 'vue-router';

const {back, push} = useRouter()
</script>
<template>
    <h1> CarListView </h1>
    <button @click="back()">Vissza</button>
    <button @click="push({name: 'cars_list', query: {page: 1}})">Oldalazas</button>
    <button @click="push({name: 'cars_create'})">Létrehozás</button>
    <button @click="push({name: 'cars_update', params: {carId: 1}})">Módosítás</button>
    <button @click="push({name: 'cars_delete', params: {carId: 1}})">Törlés</button>
    <button @click="push({name: 'cars_view', params: {carId: 1}})">Megtekintés</button>
</template>