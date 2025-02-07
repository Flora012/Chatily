<script lang="ts" setup>
import type { ForgottenSetPasswordParam } from '@/api/auth/auth';
import { useGetForgottenPassword, usePutForgottenPassword } from '@/api/auth/authQuery';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const forgottenSetPasswordParam = ref<ForgottenSetPasswordParam>({
    password: '',
    password_confirmation: ''
})
const {data} = useGetForgottenPassword()
const {mutate: putForgottenPassword, isPending  } = usePutForgottenPassword()

const {params} = useRoute()
</script>
<template>
    <v-card v-if="data?.status === 'success'">
        <v-card-title>Elfelejtett jelszó beállítás</v-card-title>
        <v-card-text>
            <v-text-field v-model="forgottenSetPasswordParam.password" label="Jelszó" variant="outlined" type="password"></v-text-field>
            
            <v-text-field v-model="forgottenSetPasswordParam.password_confirmation" label="Email" variant="outlined" type="password"></v-text-field>
        </v-card-text>
        <v-card-actions>
            <v-btn color="info" variant="elevated" @click="() => {
                putForgottenPassword({token: String(params.token), data: forgottenSetPasswordParam})
            }" :loading="isPending">
                Küldés
            </v-btn>
        </v-card-actions>
    </v-card>
    <v-card v-else>
        <v-card-title>
            Token lejárt!
        </v-card-title>

    </v-card>
</template>