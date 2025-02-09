<script lang="ts" setup>
import { useGetLoggedUser } from '@/api/profile/profileQuery';


const {data} = useGetLoggedUser()
</script>
<template>
    <v-card>
        <v-card-title>
            Profile
        </v-card-title>
        <v-card-text>
            Név: {{ data?.name }}
            <br>
            Email: {{ data?.email }}
            <br>
            Neptun kód: {{ data?.neptun_code }}
            <br>
            Státusz: {{ data?.status }}
        </v-card-text>
        <v-card-actios>
            <v-btn>CRUD</v-btn>
        </v-card-actios>
    </v-card>


</template>