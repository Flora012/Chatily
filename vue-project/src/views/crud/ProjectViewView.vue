<script setup lang="ts">
import { useShowProject } from '@/api/projects/projectQuery';

const {data} = useShowProject()

</script>
<template>
    <v-card>
        <v-card-title>
            Project létrehozása
        </v-card-title>
        <v-card-text>
          Id: {{ data?.id }}
          Név: {{ data?.name }}
          Létrehozó: {{ data?.created_by?.name }}
        </v-card-text>
    </v-card>
</template>