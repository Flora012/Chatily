<script lang="ts" setup>
import { useRouter } from 'vue-router'

const { back } = useRouter()
</script>
<template>
  <h1>CarDeleteView</h1>
  <button @click="back()">Vissza</button>
</template>
