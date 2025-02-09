<script lang="ts" setup>
import type { ForgottenPasswordParam } from '@/api/auth/auth';
import { usePostForgottenPassword } from '@/api/auth/authQuery';
import { ref } from 'vue';

const forgottenPasswordParam = ref<ForgottenPasswordParam>({
    email: '',
})

const {mutate: forgottenPassword, isPending} = usePostForgottenPassword()

</script>
<template>
    <v-card>
        <v-card-title>Elfelejtett jelszó</v-card-title>
        <v-card-text>
            <v-text-field v-model="forgottenPasswordParam.email" label="Email" variant="outlined"></v-text-field>
        </v-card-text>
        <v-card-actions>
            <v-btn color="info" variant="elevated" @click="() => {
                forgottenPassword(forgottenPasswordParam)
            }" :loading="isPending">
                Küldés
            </v-btn>
        </v-card-actions>
    </v-card>
</template>