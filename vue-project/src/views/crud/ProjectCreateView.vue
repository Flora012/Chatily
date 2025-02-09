<script setup lang="ts">
import type { ProjectCreateParam } from '@/api/projects/project';
import { usePostProject } from '@/api/projects/projectQuery';
import { ref } from 'vue';

const initProjectCreateParam :ProjectCreateParam = {
  name: ''
}
const projectCreateParam = ref<ProjectCreateParam>({
  ...initProjectCreateParam
})

const {mutate: createProject, isPending} = usePostProject()
</script>
<template>
    <v-card>
        <v-card-title>
            Project létrehozása
        </v-card-title>
        <v-card-text>
          <v-text-field
          label="Név"
          v-model="projectCreateParam.name"
          >
          </v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn  @click="() => {
           createProject(projectCreateParam) 
          }"
          :loading="isPending"
          >
            Mentés
          </v-btn>
        </v-card-actions>
    </v-card>
</template>