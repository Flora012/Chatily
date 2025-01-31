<script setup lang="ts">
import { useDeleteProject, useGetProject } from '@/api/projects/projectQuery';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const {data, isLoading} = useGetProject()
const {mutate: deleteProject, isPending} = useDeleteProject()


const itemsPerPage = ref(5)
  const headers = ref([
    { title: "Műveletek", key:"actions",align:'start'},
    { title: 'Id', key: 'id', align: 'start' },
    { title: 'Név', key: 'name', align: 'start' },
    { title: 'Létrehozó', key: 'created_by.name', align: 'start' },
  ])
  const serverItems = ref([])
  const loading = ref(true)
  const totalItems = ref(0)
  const {push} =useRouter()
</script>
<template>
    <v-card>
        <v-card-title>
            Project
            <v-btn @click="() =>{
                push({name: 'projects_create'})
            }">Létrehozás</v-btn>
        </v-card-title>
        <v-card-text>
            <v-data-table-server
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    :items="data"
    :items-length="totalItems"
    :loading="isLoading"
    item-value="id"
    hide-default-footer
  >
  <template v-slot:item.actions="{item}">
    <v-btn @click="() => {push({name: 'projects_view',params:{id:item.id}})}">Megtekintés</v-btn>
    <v-btn @click="() => {deleteProject(item.id)}" :loading="isPending">Törlés</v-btn>
    <v-btn @click="() => {push({name: 'projects_update',params:{id:item.id}})}">Módosítás</v-btn>
  </template>
</v-data-table-server>
        </v-card-text>
    </v-card>
      
</template>