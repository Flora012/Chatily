<script lang="ts" setup>
import { useRouter } from 'vue-router'

const { back } = useRouter()
</script>
<template>
  <h1>CarCreateView</h1>
  <button @click="back()">Vissza</button>
</template>
