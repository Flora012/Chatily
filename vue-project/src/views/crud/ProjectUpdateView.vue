<script setup lang="ts">
import { usePutProject, useShowProject } from '@/api/projects/projectQuery';
import { ref } from 'vue';

const {data} = useShowProject()
const projectUpdateParam = ref({
    name: data.value?.name
})

const {mutate: updateProject, isPending} = usePutProject();

</script>
<template>
    <v-card>
        <v-card-title>
            Project módosítás
        </v-card-title>
        <v-card-text>
            <v-text-field
                label="Név"
                v-model="projectUpdateParam.name"
                >
            </v-text-field>
        </v-card-text>
        <v-card-actions @click="()=>updateProject({id:data.id,projectUpdateParam})">            
        </v-card-actions>
    </v-card>
</template>